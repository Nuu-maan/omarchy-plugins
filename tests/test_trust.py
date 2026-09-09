import sys
import unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from scan import analyze
from trust import CHECKLIST, event_id, project, review


class TrustTests(unittest.TestCase):
    def test_review_requires_identity_checklist_and_exact_scan(self):
        scan = analyze({'x.qml': 'Item { property string url: "https://example.com" }'}, lint=False)
        record = {'package': '@a/b', 'commit': 'a' * 40, 'version': '1.0.0', 'scan': scan}
        value = {'package': '@a/b', 'commit': 'a' * 40, 'action': 'approve', 'notes': 'Inspected code', 'checklist': CHECKLIST, 'scanDigest': event_id(scan)}
        with self.assertRaises(ValueError):
            review(value, {'id': 2, 'login': 'stranger'}, [record], [1])
        with self.assertRaises(ValueError):
            review({**value, 'scanDigest': 'old'}, {'id': 1, 'login': 'owner'}, [record], [1])
        approved = review(value, {'id': 1, 'login': 'owner'}, [record], [1])
        self.assertEqual(project([record], [approved])[0]['status'], 'verified')
        updated = {**record, 'commit': 'b' * 40, 'scan': analyze({'x.sh': 'bash command'}, lint=False)}
        self.assertEqual(project([updated], [approved])[0]['status'], 'review-required')
        revoked = {**approved, 'action': 'revoke'}
        self.assertEqual(project([record], [approved, revoked])[0]['status'], 'revoked')
        self.assertEqual(scan['capabilities']['network'][0]['line'], 1)

    def test_qml_parser_rejects_invalid_syntax(self):
        self.assertEqual(analyze({'Valid.qml': 'import QtQuick\nItem {}'})['validation'], 'passed')
        with self.assertRaises(ValueError):
            analyze({'Invalid.qml': 'import QtQuick\nItem { broken : }'})
