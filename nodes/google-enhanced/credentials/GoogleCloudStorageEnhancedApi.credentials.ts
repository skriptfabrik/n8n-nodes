import type {
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
  Icon,
} from 'n8n-workflow';

const regions = [
  {
    name: 'africa-south1',
    displayName: 'Africa',
    location: 'Johannesburg',
  },
  {
    name: 'asia-east1',
    displayName: 'Asia Pacific',
    location: 'Changhua County',
  },
  {
    name: 'asia-east2',
    displayName: 'Asia Pacific',
    location: 'Hong Kong',
  },
  {
    name: 'asia-northeast1',
    displayName: 'Asia Pacific',
    location: 'Tokyo',
  },
  {
    name: 'asia-northeast2',
    displayName: 'Asia Pacific',
    location: 'Osaka',
  },
  {
    name: 'asia-northeast3',
    displayName: 'Asia Pacific',
    location: 'Seoul',
  },
  {
    name: 'asia-south1',
    displayName: 'Asia Pacific',
    location: 'Mumbai',
  },
  {
    name: 'asia-south2',
    displayName: 'Asia Pacific',
    location: 'Delhi',
  },
  {
    name: 'asia-southeast1',
    displayName: 'Asia Pacific',
    location: 'Jurong West',
  },
  {
    name: 'asia-southeast2',
    displayName: 'Asia Pacific',
    location: 'Jakarta',
  },
  {
    name: 'australia-southeast1',
    displayName: 'Asia Pacific',
    location: 'Sydney',
  },
  {
    name: 'australia-southeast2',
    displayName: 'Asia Pacific',
    location: 'Melbourne',
  },
  {
    name: 'europe-central2',
    displayName: 'Europe',
    location: 'Warsaw',
  },
  {
    name: 'europe-north1',
    displayName: 'Europe',
    location: 'Hamina',
  },
  {
    name: 'europe-southwest1',
    displayName: 'Europe',
    location: 'Madrid',
  },
  {
    name: 'europe-west1',
    displayName: 'Europe',
    location: 'St. Ghislain',
  },
  {
    name: 'europe-west10',
    displayName: 'Europe',
    location: 'Berlin',
  },
  {
    name: 'europe-west12',
    displayName: 'Europe',
    location: 'Turin',
  },
  {
    name: 'europe-west2',
    displayName: 'Europe',
    location: 'London',
  },
  {
    name: 'europe-west3',
    displayName: 'Europe',
    location: 'Frankfurt',
  },
  {
    name: 'europe-west4',
    displayName: 'Europe',
    location: 'Eemshaven',
  },
  {
    name: 'europe-west6',
    displayName: 'Europe',
    location: 'Zurich',
  },
  {
    name: 'europe-west8',
    displayName: 'Europe',
    location: 'Milan',
  },
  {
    name: 'europe-west9',
    displayName: 'Europe',
    location: 'Paris',
  },
  {
    name: 'me-central1',
    displayName: 'Middle East',
    location: 'Doha',
  },
  {
    name: 'me-central2',
    displayName: 'Middle East',
    location: 'Dammam',
  },
  {
    name: 'me-west1',
    displayName: 'Middle East',
    location: 'Tel Aviv',
  },
  {
    name: 'northamerica-northeast1',
    displayName: 'Americas',
    location: 'Montréal',
  },
  {
    name: 'northamerica-northeast2',
    displayName: 'Americas',
    location: 'Toronto',
  },
  {
    name: 'northamerica-south1',
    displayName: 'Americas',
    location: 'Queretaro',
  },
  {
    name: 'southamerica-east1',
    displayName: 'Americas',
    location: 'Osasco',
  },
  {
    name: 'southamerica-west1',
    displayName: 'Americas',
    location: 'Santiago',
  },
  {
    name: 'us-central1',
    displayName: 'Americas',
    location: 'Council Bluffs',
  },
  {
    name: 'us-east1',
    displayName: 'Americas',
    location: 'Moncks Corner',
  },
  {
    name: 'us-east4',
    displayName: 'Americas',
    location: 'Ashburn',
  },
  {
    name: 'us-east5',
    displayName: 'Americas',
    location: 'Columbus',
  },
  {
    name: 'us-south1',
    displayName: 'Americas',
    location: 'Dallas',
  },
  {
    name: 'us-west1',
    displayName: 'Americas',
    location: 'The Dalles',
  },
  {
    name: 'us-west2',
    displayName: 'Americas',
    location: 'Los Angeles',
  },
  {
    name: 'us-west3',
    displayName: 'Americas',
    location: 'Salt Lake City',
  },
  {
    name: 'us-west4',
    displayName: 'Americas',
    location: 'Las Vegas',
  },
] as const;

export class GoogleCloudStorageEnhancedApi implements ICredentialType {
  name = 'googleCloudStorageEnhancedApi';

  extends = ['googleApi'];

  displayName = 'Google Cloud Storage Enhanced Service Account API';

  icon: Icon = 'file:../icons/GoogleCloudStorage.svg';

  documentationUrl =
    'https://github.com/skriptfabrik/n8n-nodes/blob/main/nodes/google-enhanced/README.md';

  properties: INodeProperties[] = [
    {
      displayName: 'Region',
      name: 'region',
      type: 'options',
      options: regions.map((r) => ({
        name: `${r.displayName} (${r.location}) - ${r.name}`,
        value: r.name,
      })),
      default: 'us-central1',
      description:
        'The region where the Google Cloud service is located. This applies only to specific nodes, like the Google Vertex Chat Model',
    },
    {
      displayName: 'Service Account Email',
      name: 'email',
      type: 'string',
      placeholder: 'name@email.com',
      default: '',
      description:
        'The Google Service account similar to user-808@project.iam.gserviceaccount.com',
      required: true,
    },
    {
      displayName: 'Private Key',
      name: 'privateKey',
      type: 'string',
      default: '',
      placeholder:
        '-----BEGIN PRIVATE KEY-----\nXIYEvQIBADANBg<...>0IhA7TMoGYPQc=\n-----END PRIVATE KEY-----\n',
      description:
        'Enter the private key located in the JSON file downloaded from Google Cloud Console',
      required: true,
      typeOptions: {
        password: true,
      },
    },
    {
      displayName: 'Impersonate a User',
      name: 'inpersonate',
      type: 'boolean',
      default: false,
    },
    {
      displayName: 'Email',
      name: 'delegatedEmail',
      type: 'string',
      default: '',
      displayOptions: {
        show: {
          inpersonate: [true],
        },
      },
      description:
        'The email address of the user for which the application is requesting delegated access',
    },
    {
      displayName: 'Set up for use in HTTP Request node',
      name: 'httpNode',
      type: 'boolean',
      default: false,
    },
    {
      displayName:
        "When using the HTTP Request node, you must specify the scopes you want to send. In other nodes, they're added automatically",
      name: 'httpWarning',
      type: 'notice',
      default: '',
      displayOptions: {
        show: {
          httpNode: [true],
        },
      },
    },
    {
      displayName: 'Scope(s)',
      name: 'scopes',
      type: 'string',
      default: '',
      description:
        'You can find the scopes for services <a href="https://developers.google.com/identity/protocols/oauth2/scopes" target="_blank">here</a>',
      displayOptions: {
        show: {
          httpNode: [true],
        },
      },
    },
  ];

  test: ICredentialTestRequest = {
    request: {
      method: 'GET',
      url: '/b/',
    },
  };
}
