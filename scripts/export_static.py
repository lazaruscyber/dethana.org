#!/usr/bin/env python3
"""Export SQLite Tipiṭaka data to static JSON for the Netlify site.

The Flask app and *.db files stay on this computer. GitHub and Netlify only
need the gzipped JSON under site/public/data/ (each file is well under
GitHub's 100 MB limit).

Usage:
    python scripts/export_static.py
    python scripts/export_static.py --books Dhp,Dhp-a
"""
from __future__ import annotations

import argparse
import gzip
import json
import os
import re
import sqlite3
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / 'web_server' / 'data'
OUT_DIR = ROOT / 'site' / 'public' / 'data'
SITE_PUBLIC = ROOT / 'site' / 'public'

LANG_NAMES = {
    'en': {'english_name': 'English', 'native_name': 'English'},
    'vi': {'english_name': 'Vietnamese', 'native_name': 'Tiếng Việt'},
    'th': {'english_name': 'Thai', 'native_name': 'ไทย'},
    'si': {'english_name': 'Sinhala', 'native_name': 'සිංහල'},
    'my': {'english_name': 'Myanmar', 'native_name': 'မြန်မာ'},
    'hi': {'english_name': 'Hindi', 'native_name': 'हिन्दी'},
}


def markdown_to_html(text):
    if not text:
        return ''
    if isinstance(text, int):
        return str(text)
    text = re.sub(r'\[(.*?)\]', lambda m: '[' + m.group(1).replace('*', '') + ']', text)
    text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'\*(.*?)\*', r'<i>\1</i>', text)
    text = text.replace('<strong>', ' <strong>')
    for i in range(6, 0, -1):
        text = re.sub(r'^' + r'\#' * i + r' (.*)$', r'<h{0}>\1</h{0}>'.format(i), text, flags=re.MULTILINE)
    text = re.sub(r'`(.*?)`', r'<code>\1</code>', text)
    text = re.sub(r' *\\\[(.*?)\\\]', r'<sup title="\1">*</sup>', text)
    text = re.sub(r' *\[(.*?)\]', r'<sup title="\1">*</sup>', text)
    return text


def strip_html(text):
    return re.sub(r'<[^>]+>', '', text or '')


def connect(path: Path):
    conn = sqlite3.connect(f'file:{path.as_posix()}?mode=ro', uri=True)
    conn.row_factory = sqlite3.Row
    return conn


def parse_ref_list(value):
    if not value:
        return []
    return [p.strip() for p in str(value).split(' ') if p.strip()]


def detect_langs():
    pattern = re.compile(r'^_?epitaka_([a-z]{2})(?:_(.+))?\.db$')
    langs = {}
    if not DATA_DIR.is_dir():
        return langs
    for fname in os.listdir(DATA_DIR):
        match = pattern.match(fname)
        if not match:
            continue
        code = match.group(1)
        names = LANG_NAMES.get(code, {'english_name': code.upper(), 'native_name': code.upper()})
        langs[code] = {
            'code': code,
            'english_name': names['english_name'],
            'native_name': names['native_name'],
            'path': DATA_DIR / fname,
        }
    return langs


def load_hierarchy(pali):
    rows = pali.execute('''
        SELECT id, book_id, category, nikaya, sub_nikaya, book_name,
               mula_ref, attha_ref, tika_ref
        FROM books ORDER BY id
    ''').fetchall()
    hierarchy = {}
    for row in rows:
        hierarchy[row['book_id']] = {
            'id': row['id'],
            'category': row['category'],
            'nikaya': row['nikaya'],
            'sub_nikaya': row['sub_nikaya'],
            'book_name': row['book_name'],
            'mula_ref': parse_ref_list(row['mula_ref']),
            'attha_ref': parse_ref_list(row['attha_ref']),
            'tika_ref': parse_ref_list(row['tika_ref']),
        }
    return hierarchy


def organize_hierarchy(hierarchy):
    menu = {}
    for book_id, book in hierarchy.items():
        category = book['category'] or ''
        nikaya = book['nikaya'] or ''
        sub = book['sub_nikaya'] or ''
        menu.setdefault(category, {}).setdefault(nikaya, {}).setdefault(sub, [])
        menu[category][nikaya][sub].append([book_id, book['book_name'], book['id']])
    for category in menu.values():
        for nikaya in category.values():
            for books in nikaya.values():
                books.sort(key=lambda item: item[2])
    return menu


def enrich_refs(ids, hierarchy):
    out = []
    for bid in ids or []:
        info = hierarchy.get(bid, {})
        out.append({'book_id': bid, 'book_name': info.get('book_name', bid)})
    return out


def slug_for(title, para_id):
    return f'{(title or "").lower().replace(" ", "-")}-{para_id}'


def write_json(path: Path, payload, gz=False):
    path.parent.mkdir(parents=True, exist_ok=True)
    raw = json.dumps(payload, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
    if gz:
        path.write_bytes(gzip.compress(raw, compresslevel=6))
    else:
        path.write_bytes(raw)
    return path.stat().st_size


def sectionize(toc, sentences, translations):
    """Split book sentences into TOC sections (same rules as Flask get_section_sentences)."""
    sections = {}
    by_para = defaultdict(list)
    for row in sentences:
        by_para[row['para_id']].append(row)

    para_ids = sorted(by_para)

    def rows_between(start, end):
        out = []
        for pid in para_ids:
            if pid < start:
                continue
            if pid >= end:
                break
            out.extend(by_para[pid])
        return out

    for i, heading in enumerate(toc):
        start = heading['para_id']
        end = toc[i + 1]['para_id'] if i + 1 < len(toc) else 10 ** 9
        rows = rows_between(start, end)
        heading_translation = None
        result = []
        for idx, row in enumerate(rows):
            pid, lid = row['para_id'], row['line_id']
            tr = translations.get((pid, lid), '')
            if idx == 0 and pid == start:
                heading_translation = markdown_to_html(tr) if tr else None
                continue
            item = {
                'para_id': pid,
                'line_id': lid,
                'pali': markdown_to_html(row['pali']) if row['pali'] else '',
                'translation': markdown_to_html(tr) if tr else '',
            }
            for key in ('vripage', 'ptspage', 'mypage', 'thaipage'):
                if row[key]:
                    item[key] = row[key]
            result.append(item)
        sections[str(start)] = {
            'heading_translation': heading_translation,
            'sentences': result,
            'has_content': len(result) > 0,
        }
    return sections


def heading_has_content(section):
    return bool(section.get('has_content'))


def export_book(pali, trans_conn, book_id, hierarchy):
    toc_rows = pali.execute('''
        SELECT para_id, level, title
        FROM headings
        WHERE book_id = ? AND level <= 6
        ORDER BY para_id
    ''', (book_id,)).fetchall()
    toc = [{'para_id': r['para_id'], 'level': r['level'], 'title': r['title'] or ''} for r in toc_rows]

    sentences = pali.execute('''
        SELECT para_id, line_id, pali, vripage, ptspage, mypage, thaipage
        FROM sentences WHERE book_id = ?
        ORDER BY para_id, line_id
    ''', (book_id,)).fetchall()

    translations = {}
    if trans_conn is not None:
        for row in trans_conn.execute('''
            SELECT para_id, line_id, translation
            FROM sentences WHERE book_id = ?
        ''', (book_id,)):
            translations[(row['para_id'], row['line_id'])] = row['translation'] or ''

    sections = sectionize(toc, sentences, translations)
    toc_out = []
    for item in toc:
        section = sections.get(str(item['para_id']), {})
        has_content = heading_has_content(section)
        toc_out.append({
            'para_id': item['para_id'],
            'level': item['level'],
            'title': item['title'],
            'has_content': has_content,
            'slug': slug_for(item['title'], item['para_id']),
        })

    info = hierarchy.get(book_id, {})
    payload = {
        'book_id': book_id,
        'book_name': info.get('book_name', book_id),
        'toc': toc_out,
        'bookref': {
            'mula_ref': enrich_refs(info.get('mula_ref'), hierarchy),
            'attha_ref': enrich_refs(info.get('attha_ref'), hierarchy),
            'tika_ref': enrich_refs(info.get('tika_ref'), hierarchy),
        },
        'sections': sections,
    }
    return payload, toc_out


def snippet(html, n=220):
    text = re.sub(r'\s+', ' ', strip_html(html)).strip()
    return text[:n]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--books', default='', help='Comma-separated book_id list (default: all)')
    args = parser.parse_args()
    only = {b.strip() for b in args.books.split(',') if b.strip()}

    pali_path = DATA_DIR / 'epitaka.db'
    if not pali_path.is_file():
        sys.exit(f'Database not found: {pali_path}\nPut epitaka.db in web_server/data/ and run again.')

    langs = detect_langs()
    if not langs:
        print('No translation databases found (epitaka_xx.db). Exporting Pāli only.')
    default_lang = 'en' if 'en' in langs else (next(iter(langs)) if langs else 'en')
    trans_path = langs.get(default_lang, {}).get('path')
    trans_conn = connect(trans_path) if trans_path else None

    pali = connect(pali_path)
    hierarchy = load_hierarchy(pali)
    book_ids = [bid for bid in hierarchy if not only or bid in only]
    if only:
        missing = only - set(hierarchy)
        if missing:
            print('Unknown book ids:', ', '.join(sorted(missing)))

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    books_dir = OUT_DIR / 'books'
    books_dir.mkdir(parents=True, exist_ok=True)

    menu_payload = {
        'menu': organize_hierarchy(hierarchy),
        'hierarchy': {
            bid: {
                'nikaya': h.get('nikaya'),
                'category': h.get('category'),
                'book_name': h.get('book_name'),
            }
            for bid, h in hierarchy.items()
        },
    }
    write_json(OUT_DIR / 'menu.json', menu_payload)
    write_json(OUT_DIR / 'langs.json', [
        {'code': info['code'], 'english_name': info['english_name'], 'native_name': info['native_name']}
        for info in langs.values()
    ] or [{'code': 'en', 'english_name': 'English', 'native_name': 'English'}])

    headings = []
    site = os.environ.get('SITE_URL', 'https://dethana.org').rstrip('/')
    sitemap = [
        '/en/', '/about', '/privacy', '/dana',
        '/en/collection/nikaya', '/en/collection/abhidhamma',
        '/en/collection/vinaya', '/en/collection/expositions',
    ]
    total_bytes = 0
    for i, book_id in enumerate(book_ids, 1):
        payload, toc_out = export_book(pali, trans_conn, book_id, hierarchy)
        size = write_json(books_dir / f'{book_id}.json.gz', payload, gz=True)
        total_bytes += size
        sitemap.append(f'/en/book/{book_id}')
        for item in toc_out:
            if not item['has_content']:
                continue
            section = payload['sections'].get(str(item['para_id']), {})
            first = (section.get('sentences') or [{}])[0] if section.get('sentences') else {}
            headings.append({
                'book_id': book_id,
                'book_name': payload['book_name'],
                'para_id': item['para_id'],
                'title': item['title'],
                'slug': item['slug'],
                'pali': snippet(first.get('pali', '') or item['title']),
                'translation': snippet(first.get('translation', '') or section.get('heading_translation') or ''),
            })
            sitemap.append(f'/en/book/{book_id}/{item["slug"]}')
        if i % 10 == 0 or i == len(book_ids):
            print(f'  {i}/{len(book_ids)} books  last={book_id}  {size/1024:.0f} KB')

    hsize = write_json(OUT_DIR / 'headings.json.gz', headings, gz=True)
    total_bytes += hsize

    def xml_esc(value):
        return (
            value.replace('&', '&amp;')
            .replace('<', '&lt;')
            .replace('>', '&gt;')
            .replace('"', '&quot;')
        )

    xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for loc in sitemap:
        xml.append(f'  <url><loc>{xml_esc(site + loc)}</loc></url>')
    xml.append('</urlset>')
    (SITE_PUBLIC / 'sitemap.xml').write_text('\n'.join(xml), encoding='utf-8')

    print(f'Wrote {len(book_ids)} books, {len(headings)} searchable sections')
    print(f'Data size on disk: {total_bytes/1024/1024:.1f} MB under {OUT_DIR}')
    print('Next: cd site && npm install && npm run build')


if __name__ == '__main__':
    main()
