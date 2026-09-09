import os
import sys
import unittest
from pathlib import Path
from unittest.mock import MagicMock, patch
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
import deploy


class DeployTests(unittest.TestCase):
    def test_created_response_accepts_successful_deployment_request(self):
        response = MagicMock()
        response.__enter__.return_value.status = 201
        with patch.dict(os.environ, {'DEPLOY_HOOK': 'https://api.vercel.com/v1/integrations/deploy/example'}), patch('deploy.urlopen', return_value=response), patch('deploy.Path.exists', return_value=False):
            deploy.main()
