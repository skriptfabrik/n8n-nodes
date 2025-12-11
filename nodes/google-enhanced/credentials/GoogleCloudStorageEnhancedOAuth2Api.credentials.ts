import type {
  Icon,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

const scopes = [
  'https://www.googleapis.com/auth/cloud-platform',
  'https://www.googleapis.com/auth/cloud-platform.read-only',
  'https://www.googleapis.com/auth/devstorage.full_control',
  'https://www.googleapis.com/auth/devstorage.read_only',
  'https://www.googleapis.com/auth/devstorage.read_write',
];

export class GoogleCloudStorageEnhancedOAuth2Api implements ICredentialType {
  name = 'googleCloudStorageEnhancedOAuth2Api';

  extends = ['googleOAuth2Api'];

  displayName = 'Google Cloud Storage Enhanced OAuth2 API';

  icon: Icon = 'file:../icons/GoogleCloudStorage.svg';

  documentationUrl =
    'https://github.com/skriptfabrik/n8n-nodes/blob/main/nodes/google-enhanced/README.md';

  properties: INodeProperties[] = [
    {
      displayName: 'Scope',
      name: 'scope',
      type: 'hidden',
      default: scopes.join(' '),
    },
  ];

  test: ICredentialTestRequest = {
    request: {
      method: 'GET',
      url: '/b/',
    },
  };
}
