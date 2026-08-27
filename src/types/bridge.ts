export type EndpointCategory = 
  | 'camera'
  | 'audio'
  | 'network'
  | 'sensors'
  | 'storage'
  | 'apps'
  | 'system'
  | 'notifications'
  | 'location';

export interface ApiParam {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'enum' | 'file';
  required: boolean;
  defaultValue?: string | number | boolean;
  options?: string[];
  description: string;
}

export interface ApiEndpoint {
  id: string;
  category: EndpointCategory;
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  path: string;
  title: string;
  description: string;
  whyNotDirectTermux: string;
  requiredPermissions: string[];
  androidApiLevel: string;
  params: ApiParam[];
  sampleRequestBody?: Record<string, any>;
  sampleResponse: Record<string, any> | string;
  responseType: 'json' | 'image/jpeg' | 'audio/wav' | 'application/octet-stream';
  pythonExample: string;
  curlExample: string;
}

export interface PermissionDetail {
  permission: string;
  name: string;
  dangerous: boolean;
  purpose: string;
  androidVersionNote: string;
  howToGrant: 'runtime_dialog' | 'special_access' | 'install_time' | 'accessibility_or_root';
}

export interface AndroidFileStructure {
  path: string;
  filename: string;
  language: 'kotlin' | 'xml' | 'groovy' | 'python' | 'markdown';
  description: string;
  content: string;
}
