/** @description A notification message */
export type PlainPushMessage = {
  /** @description A type of the message */
  messageType?: string;
  /** @description A payload for the message */
  payload?: string;
};

/** @description A response from the application to request from client. The actual type of 'data' is specific to request. */
export type Response = {
  /**
   * @description A status of the server response.
   * @enum {string}
   */
  status?: 'OK' | 'WARNING' | 'ERROR';
  /** @description An optional message related to status. */
  message?: string;
  /** @description A data requested by client. */
  data?: { [key: string]: unknown };
};

/** @description aPuppet session data */
export type APuppetSessionData = {
  deviceNumber?: string;
  sessionId?: string;
  pin?: string;
};

export type APuppetPluginSettings = {
  /**
   * Format: int32
   * @description An ID of a setting record.
   */
  id?: number;
  /** @description Default aPuppet server URL */
  serverUrl: string;
  /** @description A secret for aPuppet server */
  secret: string;
};

/** @description aPuppet settings */
export type APuppetSettingsData = {
  /** Format: int32 */
  configurationId?: number;
  useDefault?: boolean;
  serverUrl?: string;
  secret?: string;
  /** Format: int32 */
  bitrate?: number;
  /** Format: int32 */
  frameRate?: number;
  notifySharing?: boolean;
  googleEncoder?: boolean;
  forceRefresh?: boolean;
  /** Format: int32 */
  appIdleTimeout?: number;
  /** Format: int32 */
  sessionTimeout?: number;
  unsaved?: boolean;
};

/** @description The settings for MDM web application */
export type Settings = {
  /**
   * Format: int32
   * @description An ID of a settings record
   */
  id?: number;
  /** @description A background color for Default Design of mobile application */
  backgroundColor?: string;
  /** @description A text color for Default Design of mobile application */
  textColor?: string;
  /** @description An URL for background image color for Default Design of mobile application */
  backgroundImageUrl?: string;
  /**
   * @description A size of the icons for Default Design of mobile application
   * @enum {string}
   */
  iconSize?: 'SMALL' | 'MEDIUM' | 'LARGE';
  /**
   * @description A type of desktop header for Default Design of mobile application
   * @enum {string}
   */
  desktopHeader?:
    | 'NO_HEADER'
    | 'DEVICE_ID'
    | 'DESCRIPTION'
    | 'CUSTOM1'
    | 'CUSTOM2'
    | 'CUSTOM3'
    | 'TEMPLATE';
  /** @description Desktop header template for Default Design of mobile application */
  desktopHeaderTemplate?: string;
  /** @description A flag indicating if browser-dependent language is to be used for content localization */
  useDefaultLanguage?: boolean;
  /** @description A combination of language and country codes used for content localization (e.g. 'en_US') */
  language?: string;
  /** @description Flag indicating if the new devices must be created on first access */
  createNewDevices?: boolean;
  /**
   * Format: int32
   * @description Default group for the new devices
   */
  newDeviceGroupId?: number;
  /**
   * Format: int32
   * @description Default configuration for the new devices
   */
  newDeviceConfigurationId?: number;
  /** @description Phone number format */
  phoneNumberFormat?: string;
  /** @description Custom property name 1 */
  customPropertyName1?: string;
  /** @description Custom property name 2 */
  customPropertyName2?: string;
  /** @description Custom property name 3 */
  customPropertyName3?: string;
  /** @description Is custom property 1 multiline */
  customMultiline1?: boolean;
  /** @description Is custom property 2 multiline */
  customMultiline2?: boolean;
  /** @description Is custom property 3 multiline */
  customMultiline3?: boolean;
  /** @description Send custom property 1 to device */
  customSend1?: boolean;
  /** @description Send custom property 2 to device */
  customSend2?: boolean;
  /** @description Send custom property 3 to device */
  customSend3?: boolean;
  /** @description Send description to device */
  sendDescription?: boolean;
  /** @description Request password reset to new users */
  passwordReset?: boolean;
  /**
   * Format: int32
   * @description Minimal password length for users
   */
  passwordLength?: number;
  /**
   * Format: int32
   * @description Password strength for users (0 - none, 1 - alphanumeric, 2 - alphanumeric + special characters
   */
  passwordStrength?: number;
  /** @description Two-factor authentication */
  twoFactor?: boolean;
  /**
   * Format: int32
   * @description Timeout in seconds for logging out while idle (0 - no logout)
   */
  idleLogout?: number;
};

/** @description Paginated data */
export type PaginatedData = {
  /** @description A list of collection items for a single page */
  items?: { [key: string]: unknown }[];
  /**
   * Format: int64
   * @description A total number of items in collection
   */
  totalItemsCount?: number;
};

/** @description The parameters for filtering the lists of audit log record objects */
export type AuditLogFilter = {
  /**
   * Format: int32
   * @description A number of records per single page of data to be retrieved
   */
  pageSize?: number;
  /**
   * Format: int32
   * @description A number of page of data to be retrieved (1-based)
   */
  pageNum?: number;
  /** @description A filter used for filtering the data records by message */
  messageFilter?: string;
  /** @description A filter used for filtering the data records by user */
  userFilter?: string;
  /**
   * Format: date-time
   * @description A timestamp for FROM boundary for filtering the data records by dates
   */
  dateFrom?: string;
  /**
   * Format: date-time
   * @description A timestamp for TO boundary for filtering the data records by dates
   */
  dateTo?: string;
  /** Format: int64 */
  dateFromMillis?: number;
  /** Format: int64 */
  dateToMillis?: number;
};

/** @description Contacts settings */
export type ContactsSettingsData = {
  /** Format: int32 */
  configurationId?: number;
  vcfUrl?: string;
  httpUsername?: string;
  httpPassword?: string;
  accountType?: string;
  /** Format: int32 */
  syncTimespan?: number;
  wipeAll?: boolean;
};

export type DeviceInfoPluginSettings = {
  /**
   * Format: int32
   * @description An ID of a setting record.
   */
  id?: number;
  /**
   * Format: int32
   * @description A period for preserving the data records in persistent data store (in days)
   */
  dataPreservePeriod: number;
  /**
   * Format: int32
   * @description An interval for transmitting data by device (in minutes)
   */
  intervalMins: number;
  /** @description A flag indicating if device must send dynamic data or not */
  sendData: boolean;
};

export type DeviceSettings = {
  /** Format: int32 */
  intervalMins?: number;
  sendData?: boolean;
};

/** @description A request for searching the dynamic info records for device */
export type DynamicInfoFilter = {
  /** @description A device identifier */
  deviceNumber?: string;
  /**
   * Format: int32
   * @description A number of records per single page of data to be retrieved
   */
  pageSize?: number;
  /**
   * Format: int32
   * @description A number of page of data to be retrieved (1-based)
   */
  pageNum?: number;
  /**
   * Format: date-time
   * @description A timestamp for FROM boundary for filtering the data records by dates
   */
  dateFrom?: string;
  /**
   * Format: date-time
   * @description A timestamp for TO boundary for filtering the data records by dates
   */
  dateTo?: string;
  /**
   * Format: int32
   * @description A fixed interval is to be used for searching the records (in seconds)
   */
  fixedInterval?: number;
  /** @description A flag indicating if a fixed interval is to be used for searching the records */
  useFixedInterval?: boolean;
  /** Format: int64 */
  dateFromMillis?: number;
  /** Format: int64 */
  dateToMillis?: number;
};

export type DeviceLookupItem = {
  /** Format: int32 */
  id?: number;
  name?: string;
  imei?: string;
  info?: string;
};

export type DeviceData = {
  /**
   * Format: int32
   * @description An ID of device data record
   */
  id?: number;
  /**
   * Format: int32
   * @description A battery level in percents
   */
  batteryLevel?: number;
  /**
   * @description A battery charge type
   * @enum {string}
   */
  batteryCharging?: 'usb' | 'ac';
  /** @description A used IP-address */
  ip?: string;
  /** @description A flag indicating if keyguard is on */
  keyguard?: boolean;
  /**
   * Format: int32
   * @description A ring volume level
   */
  ringVolume?: number;
  /** @description A flag indicating if Wi-FI is on */
  wifi?: boolean;
  /** @description A flag indicating if Mobile Data is on */
  mobileData?: boolean;
  /** @description A flag indicating if GPS is on */
  gps?: boolean;
  /** @description A flag indicating if Bluetooth is on */
  bluetooth?: boolean;
  /** @description A flag indicating if USB storage is on */
  usbStorage?: boolean;
  /**
   * Format: int32
   * @description Total memory in Mb
   */
  memoryTotal?: number;
  /**
   * Format: int32
   * @description Available memory in Mb
   */
  memoryAvailable?: number;
};

export type DeviceDynamicInfo = {
  /** Format: int32 */
  id?: number;
  /** Format: int32 */
  deviceId?: number;
  /** Format: int32 */
  customerId?: number;
  /** Format: int64 */
  ts?: number;
  device?: DeviceData;
  wifi?: WifiData;
  gps?: GpsData;
  mobile?: MobileData;
  mobile2?: MobileData;
};

export type GpsData = {
  /**
   * Format: int32
   * @description An ID of GPS data record
   */
  id?: number;
  /** @description A connection status */
  state?: string;
  /**
   * Format: double
   * @description A latitude coordinate
   */
  lat?: number;
  /**
   * Format: double
   * @description A longitude coordinate
   */
  lon?: number;
  /**
   * Format: double
   * @description An altitude coordinate
   */
  alt?: number;
  /**
   * Format: double
   * @description A speed in km/h
   */
  speed?: number;
  /**
   * Format: double
   * @description A course direction in degrees
   */
  course?: number;
};

export type MobileData = {
  /**
   * Format: int32
   * @description An ID of Mobile data record
   */
  id?: number;
  /**
   * Format: int32
   * @description A signal level
   */
  rssi?: number;
  /** @description A carrier name */
  carrier?: string;
  /** @description A flag indicating if data transmission is on */
  data?: boolean;
  /** @description A used IP-address */
  ip?: string;
  /** @description A connection status */
  state?: string;
  /** @description A SIM-card status */
  simState?: string;
  /**
   * Format: int64
   * @description A number of transmitted bytes since previous data exhange
   */
  tx?: number;
  /**
   * Format: int64
   * @description A number of received bytes since previous data exhange
   */
  rx?: number;
};

export type WifiData = {
  /**
   * Format: int32
   * @description An ID of Wi-Fi data record
   */
  id?: number;
  /**
   * Format: int32
   * @description A signal level
   */
  rssi?: number;
  /** @description A SSID */
  ssid?: string;
  /** @description A security status */
  security?: string;
  /** @description A connection status */
  state?: string;
  /** @description A used IP-address */
  ip?: string;
  /**
   * Format: int64
   * @description A number of transmitted bytes since previous data exhange
   */
  tx?: number;
  /**
   * Format: int64
   * @description A number of received bytes since previous data exhange
   */
  rx?: number;
};

export type DeviceDynamicInfoRecord = {
  /**
   * Format: int64
   * @description A timestamp of most recent update of device info (in milliseconds since epoch time)
   */
  latestUpdateTime?: number;
  /**
   * Format: int64
   * @description An interval passed from the most recent update of device info from current time
   */
  latestUpdateInterval?: number;
  /**
   * @description A type of interval passed from the most recent update of device info from current time
   * @enum {string}
   */
  latestUpdateIntervalType?: 'min' | 'hour' | 'day';
  /**
   * Format: int32
   * @description A battery level in percents
   */
  deviceBatteryLevel?: number;
  /**
   * @description A battery charge type
   * @enum {string}
   */
  deviceBatteryCharging?: 'usb' | 'ac';
  /** @description A used IP-address */
  deviceIpAddress?: string;
  /** @description A flag indicating if keyguard is on */
  deviceKeyguard?: boolean;
  /**
   * Format: int32
   * @description A ring volume level
   */
  deviceRingVolume?: number;
  /** @description A flag indicating if Wi-FI is on */
  deviceWifiEnabled?: boolean;
  /** @description A flag indicating if Mobile Data is on */
  deviceMobileDataEnabled?: boolean;
  /** @description A flag indicating if GPS is on */
  deviceGpsEnabled?: boolean;
  /** @description A flag indicating if Bluetooth is on */
  deviceBluetoothEnabled?: boolean;
  /** @description A flag indicating if USB storage is on */
  deviceUsbEnabled?: boolean;
  /**
   * Format: int32
   * @description Total device memory in Mb
   */
  deviceMemoryTotal?: number;
  /**
   * Format: int32
   * @description Available device memory in Mb
   */
  deviceMemoryAvailable?: number;
  /**
   * Format: int32
   * @description A signal level
   */
  wifiRssi?: number;
  /** @description A SSID */
  wifiSsid?: string;
  /** @description A security status */
  wifiSecurity?: string;
  /** @description A connection status */
  wifiState?: string;
  /** @description A used IP-address */
  wifiIpAddress?: string;
  /**
   * Format: int64
   * @description A number of transmitted bytes since previous data exhange
   */
  wifiTx?: number;
  /**
   * Format: int64
   * @description A number of received bytes since previous data exhange
   */
  wifiRx?: number;
  /** @description A connection status */
  gpsState?: string;
  /**
   * Format: double
   * @description A latitude coordinate
   */
  gpsLat?: number;
  /**
   * Format: double
   * @description A longitude coordinate
   */
  gpsLon?: number;
  /**
   * Format: double
   * @description An altitude coordinate
   */
  gpsAlt?: number;
  /**
   * Format: double
   * @description A speed in km/h
   */
  gpsSpeed?: number;
  /**
   * Format: double
   * @description A course direction in degrees
   */
  gpsCourse?: number;
  /**
   * Format: int32
   * @description A signal level
   */
  mobile1Rssi?: number;
  /** @description A carrier name */
  mobile1Carrier?: string;
  /** @description A flag indicating if data transmission is on */
  mobile1DataEnabled?: boolean;
  /** @description A used IP-address */
  mobile1IpAddress?: string;
  /** @description A connection status */
  mobile1State?: string;
  /** @description A SIM-card status */
  mobile1SimState?: string;
  /**
   * Format: int64
   * @description A number of transmitted bytes since previous data exhange
   */
  mobile1Tx?: number;
  /**
   * Format: int64
   * @description A number of received bytes since previous data exhange
   */
  mobile1Rx?: number;
  /**
   * Format: int32
   * @description A signal level
   */
  mobile2Rssi?: number;
  /** @description A carrier name */
  mobile2Carrier?: string;
  /** @description A flag indicating if data transmission is on */
  mobile2DataEnabled?: boolean;
  /** @description A used IP-address */
  mobile2IpAddress?: string;
  /** @description A connection status */
  mobile2State?: string;
  /** @description A SIM-card status */
  mobile2SimState?: string;
  /**
   * Format: int64
   * @description A number of transmitted bytes since previous data exhange
   */
  mobile2Tx?: number;
  /**
   * Format: int64
   * @description A number of received bytes since previous data exhange
   */
  mobile2Rx?: number;
  deviceDataIncluded?: boolean;
  wifiDataIncluded?: boolean;
  gpsDataIncluded?: boolean;
  mobile1DataIncluded?: boolean;
  mobile2DataIncluded?: boolean;
};

/** @description The details related to a single device. Such details are sent from the MDM mobile application to MDM server */
export type DeviceInfo = {
  /** @description A name of the device model */
  model?: string;
  /** @description A list of permissions set for device */
  permissions?: number[];
  /** @description A list of applications installed on device */
  applications?: Application[];
  /** @description A list of configuraiton files installed on device */
  files?: DeviceConfigurationFile[];
  /** @description An identifier of device within MDM server */
  deviceId?: string;
  /** @description An IMEI identifier */
  imei?: string;
  /** @description A phone number */
  phone?: string;
  /**
   * Format: int32
   * @description A battery level in percents
   */
  batteryLevel?: number;
  /**
   * @description A battery charge type
   * @enum {string}
   */
  batteryCharging?: 'usb' | 'ac';
  /** @description Android OS version */
  androidVersion?: string;
  /** @description A flag indicating if MDM mode is ON or not */
  mdmMode?: boolean;
  /** @description A flag indicating if kiosk mode is ON or not */
  kioskMode?: boolean;
  /** @description The details on device location */
  location?: DeviceLocation;
  /** @description Headwind MDM launcher build variant */
  launcherType?: string;
  /** @description Package of default launcher on the device */
  launcherPackage?: string;
  /** @description Is Headwind MDM a default launcher */
  defaultLauncher?: boolean;
  /** @description ICC ID */
  iccid?: string;
  /** @description an IMSI identifier */
  imsi?: string;
  /** @description An IMEI identifier for 2nd SIM slot */
  imei2?: string;
  /** @description A phone number for 2nd SIM slot */
  phone2?: string;
  /** @description ICC ID for 2nd SIM slot */
  iccid2?: string;
  /** @description an IMSI identifier for 2nd SIM slot */
  imsi2?: string;
  /** @description A device serial number */
  serial?: string;
  /** @description CPU architecture */
  cpu?: string;
  /** @description Custom property #1 */
  custom1?: string;
  /** @description Custom property #2 */
  custom2?: string;
  /** @description Custom property #3 */
  custom3?: string;
};

export type DeviceInfoApplication = {
  /** @description A name of the application */
  applicationName?: string;
  /** @description A package ID of the application */
  applicationPkg?: string;
  /** @description A number of application version already installed on device */
  versionInstalled?: string;
  /** @description A number of application version which is required to be installed on device */
  versionRequired?: string;
  versionValid?: boolean;
};

export type LookupItem = {
  /** Format: int32 */
  id?: number;
  name?: string;
};

/** @description A filter for searching the dynamic info records for device for export */
export type DynamicInfoExportFilter = {
  /** @description A device identifier */
  deviceNumber?: string;
  /**
   * Format: date-time
   * @description A timestamp for FROM boundary for filtering the data records by dates
   */
  dateFrom?: string;
  /**
   * Format: date-time
   * @description A timestamp for TO boundary for filtering the data records by dates
   */
  dateTo?: string;
  /**
   * Format: int32
   * @description A fixed interval is to be used for searching the records (in seconds)
   */
  fixedInterval?: number;
  /** @description A flag indicating if a fixed interval is to be used for searching the records */
  useFixedInterval?: boolean;
  /** @description A list of names of record fields to be exported */
  fields?: string[];
  locale?: string;
  /** Format: int64 */
  dateFromMillis?: number;
  /** Format: int64 */
  dateToMillis?: number;
};

export type DeviceLocationsPluginSettings = {
  /**
   * Format: int32
   * @description An ID of a setting record.
   */
  id?: number;
  /**
   * Format: int32
   * @description A period for preserving the data records in persistent data store (in days)
   */
  dataPreservePeriod: number;
  /** @description An URL for map tile server */
  tileServerUrl: string;
  /**
   * Format: int32
   * @description Minimal time in seconds between updates (0 - no additional updates)
   */
  updateTime: number;
};

/** @description The latest device location */
export type DeviceLocation = {
  /**
   * Format: double
   * @description A latitude coordinate
   */
  lat: number;
  /**
   * Format: double
   * @description A longitude coordinate
   */
  lon: number;
  /**
   * Format: int64
   * @description A timestamp of location recording by device (in milliseconds since epoch time)
   */
  ts: number;
};

/** @description A collection of 'Device Log' plugin settings */
export type DeviceLogPluginSettings = {
  /**
   * Format: int32
   * @description A period for preserving the log records in persistent data store (in days)
   */
  logsPreservePeriod: number;
  /** @description A list of device log rules */
  rules: DeviceLogRule[];
  identifier?: string;
};

/** @description A single rule for device log */
export type DeviceLogRule = {
  /** @description A name of the rule */
  name: string;
  /** @description A flag indicating if rule is active */
  active: boolean;
  /**
   * Format: int32
   * @description An ID referencing the application
   */
  applicationId: number;
  /**
   * @description A severity level
   * @enum {string}
   */
  severity?: 'NONE' | 'ERROR' | 'WARNING' | 'INFO' | 'DEBUG' | 'VERBOSE';
  /** @description A filter for log rule */
  filter?: string;
  /**
   * Format: int32
   * @description An ID referencing the device group
   */
  groupId: number;
  /**
   * Format: int32
   * @description An ID referencing the configuration
   */
  configurationId: number;
  /** @description A package ID for application */
  applicationPkg?: string;
  /** @description A name of the device group */
  groupName?: string;
  /** @description A name of the configuration */
  configurationName?: string;
  /** @description A list of devices related to rules */
  devices?: LookupItem[];
  identifier?: string;
};

/** @description The parameters for filtering the lists of device log record objects */
export type AppliedDeviceLogRule = {
  /** @description A package ID for application */
  packageId?: string;
  /**
   * Format: int32
   * @description A severity level
   */
  logLevel?: number;
  /** @description A filter for log rule */
  filter?: string;
};

/** @description The parameters for filtering the lists of device log record objects */
export type DeviceLogFilter = {
  /**
   * Format: int32
   * @description A number of records per single page of data to be retrieved
   */
  pageSize?: number;
  /**
   * Format: int32
   * @description A number of page of data to be retrieved (1-based)
   */
  pageNum?: number;
  /** @description A filter used for filtering the data records by device */
  deviceFilter?: string;
  /** @description A filter used for filtering the data records by message */
  messageFilter?: string;
  /**
   * Format: date-time
   * @description A timestamp for FROM boundary for filtering the data records by dates
   */
  dateFrom?: string;
  /**
   * Format: date-time
   * @description A timestamp for TO boundary for filtering the data records by dates
   */
  dateTo?: string;
  /** @description A package ID of an application for filtering the data records by application */
  applicationFilter?: string;
  /**
   * Format: int32
   * @description A severity for filtering the data records
   */
  severity?: number;
  /** @description A name of sorting column */
  sortValue?: string;
  /** Format: int64 */
  dateFromMillis?: number;
  /** Format: int64 */
  dateToMillis?: number;
};

export type UploadedDeviceLogRecord = {
  /**
   * Format: int64
   * @description A timestamp of creation of log record (in milliseconds since epoch time
   */
  timestamp?: number;
  /** @description A package ID of an application related to log record */
  packageId?: string;
  /**
   * Format: int32
   * @description A severity for log record
   */
  logLevel?: number;
  /** @description A message for log record */
  message?: string;
};

/** @description A device registered to MDM server and running the MDM mobile application */
export type Device = {
  /**
   * Format: int32
   * @description An ID of device
   */
  id?: number;
  /** @description An unique textual identifier of device */
  number?: string;
  /** @description A description of device */
  description?: string;
  /**
   * Format: int64
   * @description A date of last synchronization of device state
   */
  lastUpdate?: number;
  /**
   * Format: int32
   * @description An ID of configuration for device
   */
  configurationId?: number;
  /** @description An info on device state submitted by device to MDM server */
  info?: string;
  /** @description An IMEM of device */
  imei?: string;
  /** @description A phone number of device */
  phone?: string;
  /**
   * Format: int64
   * @description A date of last IMEI change
   */
  imeiUpdateTs?: number;
  /** @description Public IP address */
  publicIp?: string;
  /** @description Custom property #1 */
  custom1?: string;
  /** @description Custom property #2 */
  custom2?: string;
  /** @description Custom property #3 */
  custom3?: string;
  /** @description A list of groups assigned to device */
  groups?: LookupItem[];
  /** @description Old device number, used when the number is changed */
  oldNumber?: string;
  /** @description Last characters of the device number used for fast search */
  fastSearch?: string;
};

export type DeviceLockRequest = {
  /** Format: int32 */
  deviceId?: number;
  lock?: boolean;
  message?: string;
};

export type PasswordResetRequest = {
  /** Format: int32 */
  deviceId?: number;
  password?: string;
};

/** @description The parameters for filtering the lists of rule objects */
export type RuleFilter = {
  /**
   * Format: int32
   * @description A number of records per single page of data to be retrieved
   */
  pageSize?: number;
  /**
   * Format: int32
   * @description A number of page of data to be retrieved (1-based)
   */
  pageNum?: number;
  /**
   * Format: int32
   * @description A filter used for filtering the rules by configuration
   */
  configurationFilter?: number;
  /** @description A filter used for filtering the rules by pattern */
  patternFilter?: string;
  /**
   * @description A filter used for filtering the rules by rule table
   * @enum {string}
   */
  tableTypeFilter?:
    | 'OUTGOING_CALL'
    | 'INCOMING_CALL'
    | 'OUTGOING_SMS'
    | 'INCOMING_SMS'
    | 'URL';
  /**
   * @description A filter used for filtering the rules by rule type
   * @enum {string}
   */
  ruleTypeFilter?: 'BLACKLIST' | 'WHITELIST';
  /** @description A name of sorting column */
  sortValue?: string;
  /** @description A direction to sort rule list */
  sortDir?: string;
};

export type Rule = {
  /**
   * Format: int32
   * @description An ID of rule record
   */
  id?: number;
  /**
   * Format: int32
   * @description Customer ID
   */
  customerId?: number;
  /**
   * Format: int32
   * @description Configuration ID
   */
  configurationId?: number;
  /** @description Rule pattern */
  rule?: string;
  /**
   * @description Rule table type
   * @enum {string}
   */
  tableType?:
    | 'OUTGOING_CALL'
    | 'INCOMING_CALL'
    | 'OUTGOING_SMS'
    | 'INCOMING_SMS'
    | 'URL';
  /**
   * @description Rule type (blacklist or whitelist)
   * @enum {string}
   */
  ruleType?: 'BLACKLIST' | 'WHITELIST';
};

/** @description Options applied when a device must be created on demand */
export type DeviceCreateOptions = {
  /** @description Customer name */
  customer?: string;
  /** @description Configuration for the new device */
  configuration?: string;
  /** @description Groups for the new device */
  groups?: string[];
};

export type CopyProfileRequest = {
  /** Format: int32 */
  configSrc?: number;
  /** Format: int32 */
  configDst?: number;
  removeExisting?: boolean;
};

/** @description The parameters for filtering the lists of message objects */
export type MessageFilter = {
  /**
   * Format: int32
   * @description A number of records per single page of data to be retrieved
   */
  pageSize?: number;
  /**
   * Format: int32
   * @description A number of page of data to be retrieved (1-based)
   */
  pageNum?: number;
  /** @description A filter used for filtering the data records by device */
  deviceFilter?: string;
  /** @description A filter used for filtering the data records by message */
  messageFilter?: string;
  /**
   * Format: date-time
   * @description A timestamp for FROM boundary for filtering the data records by dates
   */
  dateFrom?: string;
  /**
   * Format: date-time
   * @description A timestamp for TO boundary for filtering the data records by dates
   */
  dateTo?: string;
  /**
   * Format: int32
   * @description A status for filtering the data records
   */
  status?: number;
  /** @description A name of sorting column */
  sortValue?: string;
  /** Format: int64 */
  dateFromMillis?: number;
  /** Format: int64 */
  dateToMillis?: number;
};

export type SendRequest = {
  scope?: string;
  deviceNumber?: string;
  /** Format: int32 */
  groupId?: number;
  /** Format: int32 */
  configurationId?: number;
  message?: string;
};

/** @description OpenVPN settings */
export type OpenVPNSettingsData = {
  /** Format: int32 */
  configurationId?: number;
  removeVpns?: string;
  removeAll?: boolean;
  vpnName?: string;
  vpnConfig?: string;
  vpnUrl?: string;
  connect?: boolean;
  alwaysOn?: boolean;
};

/** @description OpenVPN run app command */
export type OpenVPNRunAppData = {
  scope?: string;
  /** Format: int32 */
  configurationId?: number;
  deviceNumber?: string;
};

/** @description A collection of 'Photo' plugin settings */
export type PhotoPluginSettings = {
  /**
   * Format: int32
   * @description An ID of the record
   */
  id?: number;
  /** @description A flag indicating if the location of the device needs to be recorded */
  trackLocation?: boolean;
  /** @description A message to display to user in case the location tracking is switched off */
  trackingOffWarning?: string;
  /** @description A flag indicating if the photo needs to be sent to server */
  sendPhoto?: boolean;
  /** @description The paths to images (separated with ;) */
  imagePaths?: string;
  /** @description Paths that do not require transmission (separated ;) */
  nonTransmittedPaths?: string;
  /** @description A flag indicating if standard image paths are to be included */
  includeStandardImagePaths?: boolean;
  /**
   * Format: int32
   * @description A delay before deleting the images (in seconds)
   */
  imageDeletionDelay?: number;
  /** @description A flag indicating if a text needs to be added to photo */
  addText?: boolean;
  /** @description A background color */
  backgroundColor?: string;
  /** @description A text color */
  textColor?: string;
  /**
   * Format: int32
   * @description A transparency for the background
   */
  transparency?: number;
  /** @description A text to be added to photo */
  textContent?: string;
  /** @description A flag indicating if the photo needs to be linked to pre-defined place */
  linkPhotoToPlace?: boolean;
  /**
   * Format: int32
   * @description A radius for searching the nearest place for photo (in meters)
   */
  searchPlaceRadius?: number;
  /** @description Types of non-image files to transfer, comma-separated */
  fileTypes?: string;
  /** @description Directory structure on the server */
  directory?: string;
  /**
   * Format: int32
   * @description Remove files older than this amount of days (0 - do not remove)
   */
  purgeDays?: number;
  /** @description Template for file names on the server */
  nameTemplate?: string;
};

/** @description A photo plugin settings to be used on mobile device */
export type PhotoPluginDeviceSettings = {
  /** @description A background color */
  backgroundColor?: string;
  /** @description A text color */
  textColor?: string;
  /** @description A flag indicating if the location of the device needs to be recorded */
  trackLocation?: boolean;
  /** @description A message to display to user in case the location tracking is switched off */
  trackingOffWarning?: string;
  /** @description A flag indicating if the photo needs to be sent to server */
  sendPhoto?: boolean;
  /** @description The paths to images (separated with ;) */
  imagePaths?: string;
  /**
   * Format: int32
   * @description A delay before deleting the images (in seconds)
   */
  imageDeletionDelay?: number;
  /** @description A flag indicating if a text needs to be added to photo */
  addText?: boolean;
  /**
   * Format: int32
   * @description A transparency for the background
   */
  transparency?: number;
  /** @description A flag indicating if the photo needs to be linked to pre-defined place */
  linkPhotoToPlace?: boolean;
  /** @description Paths that do not require transmission (separated ;) */
  nonTransmittedPaths?: string;
  /** @description A flag indicating if standard image paths are to be included */
  includeStandardImagePaths?: boolean;
  /** @description Additional file types to transmit (separated by ;) */
  fileTypes?: string;
  /** @description A text to be added to photo */
  textContent?: string;
};

/** @description The parameters for filtering the lists of photo objects */
export type PhotoFilter = {
  /**
   * Format: int32
   * @description A number of records per single page of data to be retrieved
   */
  pageSize?: number;
  /**
   * Format: int32
   * @description A number of page of data to be retrieved (1-based)
   */
  pageNum?: number;
  /** @description A filter used for filtering the data records by device */
  deviceFilter?: string;
  /** @description A filter used for filtering the data records by address */
  addressFilter?: string;
  /**
   * Format: date-time
   * @description A timestamp for FROM boundary for filtering the data records by dates
   */
  dateFrom?: string;
  /**
   * Format: date-time
   * @description A timestamp for TO boundary for filtering the data records by dates
   */
  dateTo?: string;
  /** @description A name of sorting column */
  sortValue?: string;
  /** @description A filter used for filtering the data records by related point */
  pointFilter?: string;
};

/** @description The parameters for filtering the lists of place objects */
export type PlaceFilter = {
  /**
   * Format: int32
   * @description A number of records per single page of data to be retrieved
   */
  pageSize?: number;
  /**
   * Format: int32
   * @description A number of page of data to be retrieved (1-based)
   */
  pageNum?: number;
  /** @description A filter used for filtering the data records */
  filter?: string;
};

export type PlaceImportConfirmRequest = {
  uuid?: string;
  /** Format: int32 */
  existingMode?: number;
  deleteExisting?: boolean;
};

export type PlaceImportRequest = {
  /** Format: int32 */
  placeIdColumnIndex?: number;
  /** Format: int32 */
  latColumnIndex?: number;
  /** Format: int32 */
  lngColumnIndex?: number;
  /** Format: int32 */
  addressColumnIndex?: number;
  filePathId?: string;
};

/** @description A place found around some cooridnates */
export type PlaceSearchResultItem = {
  /** @description A place ID */
  pointId?: string;
  /** @description A place address */
  pointAddress?: string;
  /**
   * Format: double
   * @description A latitude coordinate for place location
   */
  lat?: number;
  /**
   * Format: double
   * @description A longitude coordinate for place location
   */
  lng?: number;
  /**
   * Format: double
   * @description A distance to target location (in meters)
   */
  distance?: number;
};

/** @description The parameters for filtering the lists of message objects */
export type PushMessageFilter = {
  /**
   * Format: int32
   * @description A number of records per single page of data to be retrieved
   */
  pageSize?: number;
  /**
   * Format: int32
   * @description A number of page of data to be retrieved (1-based)
   */
  pageNum?: number;
  /** @description A filter used for filtering the data records by device */
  deviceFilter?: string;
  /** @description A filter used for filtering the data records by message */
  messageFilter?: string;
  /**
   * Format: date-time
   * @description A timestamp for FROM boundary for filtering the data records by dates
   */
  dateFrom?: string;
  /**
   * Format: date-time
   * @description A timestamp for TO boundary for filtering the data records by dates
   */
  dateTo?: string;
  /** @description A name of sorting column */
  sortValue?: string;
  /** Format: int64 */
  dateFromMillis?: number;
  /** Format: int64 */
  dateToMillis?: number;
};

export type PushSendRequest = {
  scope?: string;
  deviceNumber?: string;
  /** Format: int32 */
  groupId?: number;
  /** Format: int32 */
  configurationId?: number;
  messageType?: string;
  payload?: string;
};

/** @description The parameters for filtering the lists of scheduled messages */
export type PushScheduleFilter = {
  /**
   * Format: int32
   * @description A number of records per single page of data to be retrieved
   */
  pageSize?: number;
  /**
   * Format: int32
   * @description A number of page of data to be retrieved (1-based)
   */
  pageNum?: number;
  /** @description A filter used for filtering the data records by message */
  messageFilter?: string;
  /** @description A filter used for filtering the data records by payload */
  payloadFilter?: string;
  /** @description A name of sorting column */
  sortValue?: string;
};

export type PluginPushSchedule = {
  /**
   * Format: int32
   * @description ID of scheduled Push record
   */
  id?: number;
  /**
   * Format: int32
   * @description Customer ID
   */
  customerId?: number;
  /**
   * Format: int32
   * @description Device ID (if scope is device)
   */
  deviceId?: number;
  /**
   * Format: int32
   * @description Group ID (if scope is group)
   */
  groupId?: number;
  /**
   * Format: int32
   * @description Configuration ID (if scope is configuration)
   */
  configurationId?: number;
  /** @description Device number (if scope is device) */
  deviceNumber?: string;
  /** @description Group name (if scope is group) */
  groupName?: string;
  /** @description Configuration name (if scope is configuration) */
  configurationName?: string;
  /** @description Target name (device number or group name or config name) */
  target?: string;
  /** @description Message scope (device, group, configuration, all) */
  scope?: string;
  /** @description Push Message type */
  messageType?: string;
  /** @description Push Message payload */
  payload?: string;
  /** @description Comment to the scheduled task */
  comment?: string;
  /** @description Scheduled minutes (readable representation in Crontab format) */
  min?: string;
  /** @description Scheduled minutes (bit string representation '0101...') */
  minBit?: string;
  /** @description Scheduled hours (readable representation in Crontab format) */
  hour?: string;
  /** @description Scheduled hours (bit string representation '0101...') */
  hourBit?: string;
  /** @description Scheduled days of month (readable representation in Crontab format) */
  day?: string;
  /** @description Scheduled days of month (bit string representation '0101...') */
  dayBit?: string;
  /** @description Scheduled days of week (readable representation in Crontab format) */
  weekday?: string;
  /** @description Scheduled days of week (bit string representation '0101...') */
  weekdayBit?: string;
  /** @description Scheduled months (readable representation in Crontab format) */
  month?: string;
  /** @description Scheduled months (bit string representation '0101...') */
  monthBit?: string;
};

export type UrlfilterPluginList = {
  /**
   * Format: int32
   * @description An ID of a list record.
   */
  id?: number;
  /** @description A key to access the list from a public resource. */
  key: string;
  /** @description The displayed name of the list. */
  name: string;
  /** @description The comment to the list. */
  comment?: string;
  /**
   * Format: int32
   * @description Count of items in the list.
   */
  count?: number;
  /** @description The list contents (separated by line breaks or spaces). */
  list: string;
};

/** @description The parameters for filtering the lists of objects */
export type ListFilter = {
  /**
   * Format: int32
   * @description A number of records per single page of data to be retrieved
   */
  pageSize?: number;
  /**
   * Format: int32
   * @description A number of page of data to be retrieved (1-based)
   */
  pageNum?: number;
  /** @description A filter used for filtering the objects */
  filter?: string;
  /** @description A name of sorting column */
  sortValue?: string;
  /** @description A direction to sort rule list */
  sortDir?: string;
};

/** @description URL Filter data */
export type UrlfilterConfigurationData = {
  /** Format: int32 */
  configurationId?: number;
  configurationName?: string;
  active?: boolean;
  blockAds?: boolean;
  blacklistName?: string;
  blacklistKey?: string;
  /** Format: int32 */
  blacklistCount?: number;
  whitelistName?: string;
  whitelistKey?: string;
  /** Format: int32 */
  whitelistCount?: number;
};

/** @description A specification of a single application installed and used on mobile device */
export type Application = {
  /**
   * Format: int32
   * @description An application ID
   */
  id?: number;
  /** @description A name of application */
  name?: string;
  /** @description A package ID of application */
  pkg?: string;
  /** @description A version of application */
  version?: string;
  /**
   * Format: int32
   * @description Version code
   */
  versionCode?: number;
  /** @description CPU architecture (for file transfer only) */
  arch?: string;
  /** @description An URL for the latest version of the application package */
  url?: string;
  /** @description Has the latest version native code, i.e. is split into two APKs */
  split?: boolean;
  /** @description An URL for armeabi APK for the latest version */
  urlArmeabi?: string;
  /** @description An URL for arm64 APK for the latest version */
  urlArm64?: string;
  /** @description A flag indicating if icon is to be shown on mobile device */
  showIcon?: boolean;
  /** @description A flag indicating if the web application must run in Kiosk Browser */
  useKiosk?: boolean;
  /** @description A flag indicating if application is a system application */
  system?: boolean;
  /** @description A list of configurations using the application */
  configurations?: Configuration[];
  /**
   * Format: int32
   * @description An ID of a most recent version for application
   */
  latestVersion?: number;
  /** @description A flag indicating if application must be run after installation */
  runAfterInstall?: boolean;
  /** @description A flag indicating if application must be run at device boot */
  runAtBoot?: boolean;
  /** @description A flag indicating if version check must be skipped for application */
  skipVersion?: boolean;
  /** @description A text for the application icon */
  iconText?: string;
  /**
   * @description A type of the application icon
   * @enum {string}
   */
  type?: 'app' | 'web';
  /**
   * Format: int32
   * @description An ID of an icon to represent the application
   */
  iconId?: number;
  /** @description An file name with the icon to represent the application */
  icon?: string;
  /**
   * Format: int32
   * @description Order of applications on the screen
   */
  screenOrder?: number;
  /**
   * Format: int32
   * @description Key code for fast app start
   */
  keyCode?: number;
  /** @description A flag indicating if application must be displayed at the bottom of the launcher */
  bottom?: boolean;
  /** @description A flag indicating if app settings could be opened by a long tap */
  longTap?: boolean;
  /** @description An intent */
  intent?: string;
  /**
   * Format: int32
   * @enum {integer}
   */
  action?: 0 | 1 | 2;
};

/** @description A single setting for an application installed and used on mobile device */
export type ApplicationSetting = {
  /**
   * Format: int32
   * @description An ID of a setting record
   */
  id?: number;
  /**
   * Format: int32
   * @description An ID of application
   */
  applicationId: number;
  /** @description A name of the setting */
  name: string;
  /**
   * @description A type of the application setting
   * @enum {string}
   */
  type: 'STRING' | 'INTEGER' | 'BOOLEAN';
  /** @description A value of the setting */
  value?: string;
  /** @description A comment on the setting */
  comment?: string;
  /**
   * Format: int64
   * @description A timestamp of the last update of the setting
   */
  lastUpdate?: number;
  /** @description A flag indicating if setting can not be modified on device */
  readonly: boolean;
  /**
   * Format: int32
   * @description An ID of the external object (device, configuration) which settings belong to
   */
  extRefId: number;
  /** @description A package name of the application */
  applicationPkg?: string;
  /** @description A name of the application */
  applicationName?: string;
};

/** @description An MDM configuration used on mobile device */
export type Configuration = {
  /**
   * Format: int32
   * @description A configuration ID
   */
  id?: number;
  /** @description A unique name of configuration */
  name?: string;
  /** @description A description of configuration */
  description?: string;
  /** @description A password for administrator of configuration (MD5 hash) */
  password?: string;
  /** @description A list of applications set for configuration */
  applications?: Application[];
  /** @description A flag indicating if status bar is locked */
  blockStatusBar?: boolean;
  /**
   * Format: int32
   * @description A system update type. 0-Default, 1-Immediately, 2-Scheduled, 3-Postponed
   * @enum {integer}
   */
  systemUpdateType?: 0 | 1 | 2 | 3;
  /** @description A start time for system update period formatted as HH:MM. (If system update time is 2) */
  systemUpdateFrom?: string;
  /** @description An end time for system update period formatted as HH:MM. (If system update time is 2) */
  systemUpdateTo?: string;
  /** @description A flag indicating if the application update must be scheduled */
  scheduleAppUpdate?: boolean;
  /** @description A start time for app update period formatted as HH:MM. */
  appUpdateFrom?: string;
  /** @description An end time for system update period formatted as HH:MM. */
  appUpdateTo?: string;
  /**
   * @description Limits downloading updates
   * @enum {string}
   */
  downloadUpdates?: 'UNLIMITED' | 'LIMITED' | 'WIFI';
  /** @description A flag indicating if GPS is enabled on device */
  gps?: boolean;
  /** @description A flag indicating if Bluetooth is enabled on device */
  bluetooth?: boolean;
  /** @description A flag indicating if Wi-Fi is enabled on device */
  wifi?: boolean;
  /** @description A flag indicating if Mobile Data is enabled on device */
  mobileData?: boolean;
  /** @description A flag indicating if USB storage is enabled on device */
  usbStorage?: boolean;
  /**
   * @description A type of location tracking
   * @enum {string}
   */
  requestUpdates?: 'DONOTTRACK' | 'GPS' | 'WIFI';
  /** @description A flag indicating if location permission shouldn't be granted */
  disableLocation?: boolean;
  /**
   * @description Strategy of app permission auto-granting
   * @enum {string}
   */
  appPermissions?: 'GRANTALL' | 'ASKLOCATION' | 'DENYLOCATION' | 'ASKALL';
  /** @description Push notification options */
  pushOptions?: string;
  /**
   * Format: int32
   * @description Keep-Alive time for MQTT connection
   */
  keepaliveTime?: number;
  /** @description Brightness management flag. null: not managed, false: manual, true: auto */
  autoBrightness?: boolean;
  /**
   * Format: int32
   * @description Brightness value (if manual), 0-255
   */
  brightness?: number;
  /** @description A flag indicating if screen timeout is managed on device */
  manageTimeout?: boolean;
  /**
   * Format: int32
   * @description Timeout value (in seconds)
   */
  timeout?: number;
  /** @description A flag indicating if volume is locked on device */
  lockVolume?: boolean;
  /** @description A flag indicating if volume must be adjusted on device */
  manageVolume?: boolean;
  /**
   * Format: int32
   * @description Volume value (in percents)
   */
  volume?: number;
  /** @description Password requirements for the mobile device */
  passwordMode?: string;
  /**
   * Format: int32
   * @description Orientation lock: 0 - none, 1 - portrait, 2 - landscape
   */
  orientation?: number;
  /** @description Flag enabling usage with default launcher */
  runDefaultLauncher?: boolean;
  /** @description Flag indicating if screenshots are disabled on the device */
  disableScreenshots?: boolean;
  /** @description Flag indicating if auto-started apps should be kept in the foreground */
  autostartForeground?: boolean;
  /** @description Time zone settings: null for using default settings, auto for automatic time zone, or Olson time zone string */
  timeZone?: string;
  /** @description Allowed classes, separated by comma */
  allowedClasses?: string;
  /** @description New server URL used to migrate to another server */
  newServerUrl?: string;
  /** @description Flag disabling safe settings */
  lockSafeSettings?: boolean;
  /** @description Flag enabling permissive mode */
  permissive?: boolean;
  /** @description Flag enabling the kiosk exit button */
  kioskExit?: boolean;
  /** @description Show WiFi settings if there's a connection error, also in Kiosk mode */
  showWifi?: boolean;
  /**
   * Format: int32
   * @description A package ID for main application
   */
  mainAppId?: number;
  /** @description A package ID for event receiving component */
  eventReceivingComponent?: string;
  /** @description A flag indicating if MDM is operating in kiosk mode */
  kioskMode?: boolean;
  /**
   * Format: int32
   * @description A package ID for content application
   */
  contentAppId?: number;
  /** @description WiFi SSID for provisioning */
  wifiSSID?: string;
  /** @description WiFi password for provisioning */
  wifiPassword?: string;
  /** @description WiFi security type for provisioning: NONE/WPA/WEP/EAP */
  wifiSecurityType?: string;
  /** @description Device encryption */
  encryptDevice?: boolean;
  /** @description Additional QR code parameters */
  qrParameters?: string;
  /** @description Prefer mobile data for provisioning */
  mobileEnrollment?: boolean;
  /** @description Flag enabling Home button in kiosk mode */
  kioskHome?: boolean;
  /** @description Flag enabling Recents button in kiosk mode */
  kioskRecents?: boolean;
  /** @description Flag enabling notifications in kiosk mode */
  kioskNotifications?: boolean;
  /** @description Flag enabling system info in kiosk mode */
  kioskSystemInfo?: boolean;
  /** @description Flag enabling lock screen in kiosk mode */
  kioskKeyguard?: boolean;
  /** @description Flag locking power button in kiosk mode */
  kioskLockButtons?: boolean;
  /** @description Flag forcing screen to be on in kiosk mode */
  kioskScreenOn?: boolean;
  /** @description Overridden launcher URL */
  launcherUrl?: string;
  /** @description Additional comma separated restrictions in MDM mode */
  restrictions?: string;
  useDefaultDesignSettings?: boolean;
  /** @description A background color to use when running MDM application */
  backgroundColor?: string;
  /** @description A text color to use when running MDM application */
  textColor?: string;
  /** @description An URL for background image to use when running MDM application */
  backgroundImageUrl?: string;
  /**
   * @description A size of the icons to use when running MDM application
   * @enum {string}
   */
  iconSize?: 'SMALL' | 'MEDIUM' | 'LARGE';
  /**
   * @description A type of desktop header to use when running MDM application
   * @enum {string}
   */
  desktopHeader?:
    | 'NO_HEADER'
    | 'DEVICE_ID'
    | 'DESCRIPTION'
    | 'CUSTOM1'
    | 'CUSTOM2'
    | 'CUSTOM3'
    | 'TEMPLATE';
  /** @description Desktop header template */
  desktopHeaderTemplate?: string;
  /** @description If checked, the data of the device status bar (time, battery, etc) are displayed by Headwind MDM */
  displayStatus?: boolean;
  /** @description A list of settings for applications set for configuration */
  applicationSettings?: ApplicationSetting[];
  /** @description A list of files to be used on devices */
  files?: ConfigurationFile[];
  /** @description The parameters for using applications set for configuration */
  applicationUsageParameters?: ConfigurationApplicationParameters[];
};

/** @description A collection of parameters for linking the single application to single configuration */
export type ConfigurationApplicationParameters = {
  /**
   * Format: int32
   * @description A record ID
   */
  id?: number;
  /**
   * Format: int32
   * @description A configuration ID
   */
  configurationId?: number;
  /**
   * Format: int32
   * @description An application ID
   */
  applicationId?: number;
  /** @description A flag indicating if version check must be skipped on device */
  skipVersionCheck?: boolean;
};

/** @description A configuration file to be sent to mobile device for usage */
export type ConfigurationFile = {
  /**
   * Format: int32
   * @description A configuration file ID
   */
  id?: number;
  /** @description A description of the file */
  description?: string;
  /** @description A checksum for the file content */
  checksum?: string;
  /** @description A flag indicating if file is to be removed from the device or not */
  remove?: boolean;
  /**
   * Format: int64
   * @description A timestamp of file uploading to server (in milliseconds since epoch time)
   */
  lastUpdate?: number;
  /** @description An URL referencing the content of the file */
  url?: string;
  /** @description A flag indicating whether the file content must be updated by device-specific values */
  replaceVariables?: boolean;
  /** @description A path to a file on device (including the file name) */
  path?: string;
};

/** @description A link between the single application and single configuration */
export type ApplicationConfigurationLink = {
  /**
   * Format: int32
   * @description An ID of a link between the application and configuration. May be null if those are not linked
   */
  id?: number;
  /**
   * Format: int32
   * @description An ID of a customer account which both the application and configuration belong to
   */
  customerId?: number;
  /**
   * Format: int32
   * @description An ID of a configuration
   */
  configurationId?: number;
  /** @description A name of a configuration */
  configurationName?: string;
  /**
   * Format: int32
   * @description An ID of an application
   */
  applicationId?: number;
  /** @description A name of an application */
  applicationName?: string;
  /**
   * Format: int32
   * @description An action required to be performed by mobile device in regard to application installation
   * @enum {integer}
   */
  action?: 0 | 1 | 2;
  /** @description A flag indicating if icon is to be shown on mobile device */
  showIcon?: boolean;
  /** @description A flag indicating that application is to be removed from the application */
  remove?: boolean;
  /** @description A flag indicating if more recent version of application exists */
  outdated?: boolean;
  /** @description A latest version of the application */
  latestVersionText?: string;
  /** @description A current version of the application as set for configuration */
  currentVersionText?: string;
  /** @description Set by front-end when the configuration needs to be notified about changes */
  notify?: boolean;
};

/** @description A link between the single application version and single configuration */
export type ApplicationVersionConfigurationLink = {
  /**
   * Format: int32
   * @description An ID of a link between the application and configuration. May be null if those are not linked
   */
  id?: number;
  /**
   * Format: int32
   * @description An ID of a customer account which both the application and configuration belong to
   */
  customerId?: number;
  /**
   * Format: int32
   * @description An ID of a configuration
   */
  configurationId?: number;
  /** @description A name of a configuration */
  configurationName?: string;
  /**
   * Format: int32
   * @description An ID of an application
   */
  applicationId?: number;
  /** @description A name of an application */
  applicationName?: string;
  /**
   * Format: int32
   * @description An ID of an application version
   */
  applicationVersionId?: number;
  /**
   * Format: int32
   * @description A version text of an application version
   */
  versionText?: number;
  /** @description A flag indicating if icon is to be shown on mobile device */
  showIcon?: boolean;
  /**
   * Format: int32
   * @description Order of applications on the screen
   */
  screenOrder?: number;
  /**
   * Format: int32
   * @description Key code for fast app start
   */
  keyCode?: number;
  /** @description A flag indicating if application must be displayed at the bottom of the launcher */
  bottom?: boolean;
  /** @description A flag indicating if app settings could be opened by a long tap */
  longTap?: boolean;
  /**
   * Format: int32
   * @description An action required to be performed by mobile device in regard to application installation
   * @enum {integer}
   */
  action?: 0 | 1 | 2;
  /** @description A flag indicating that application is to be removed from the application */
  remove?: boolean;
  /** @description Set by front-end when the configuration needs to be notified about changes */
  notify?: boolean;
};

/** @description A request to setup links between the single application version and listed configurations */
export type LinkConfigurationsToAppVersionRequest = {
  /**
   * Format: int32
   * @description An ID of an application version to link configurations to
   */
  applicationVersionId?: number;
  /** @description A list of configurations to link to application version */
  configurations?: ApplicationVersionConfigurationLink[];
};

/** @description A specification of a single application version installed and used on mobile device */
export type ApplicationVersion = {
  /**
   * Format: int32
   * @description An application version ID
   */
  id?: number;
  /**
   * Format: int32
   * @description An application ID
   */
  applicationId?: number;
  /** @description A version of application */
  version?: string;
  /**
   * Format: int32
   * @description Version code
   */
  versionCode?: number;
  /** @description An URL for application package */
  url?: string;
  /** @description Has the APK native code, i.e. is split into two APKs */
  split?: boolean;
  /** @description An URL for armeabi APK */
  urlArmeabi?: string;
  /** @description An URL for arm64 APK */
  urlArm64?: string;
};

/** @description A request to setup links between the single application and listed configurations */
export type LinkConfigurationsToAppRequest = {
  /**
   * Format: int32
   * @description An ID of an application to link configurations to
   */
  applicationId?: number;
  /** @description A list of configurations to link to application */
  configurations?: ApplicationConfigurationLink[];
};

/** @description A request to upgrade application for configuration up to recent version */
export type UpgradeConfigurationApplicationRequest = {
  /**
   * Format: int32
   * @description An ID of a configuration to upgrade application for
   */
  configurationId?: number;
  /**
   * Format: int32
   * @description An ID of an application to upgrade
   */
  applicationId?: number;
};

/** @description A specification of a single application available for usage on mobile device */
export type ApplicationView = {
  /** @description A name of application */
  name?: string;
  /**
   * Format: int32
   * @description An application ID
   */
  id?: number;
  /** @description A version of application */
  version?: string;
  /**
   * Format: int32
   * @description The action required to be performed by mobile device
   * @enum {integer}
   */
  action?: 0 | 1 | 2;
  /** @description A package ID of application */
  pkg?: string;
  /** @description An URL for application package */
  url?: string;
  /** @description A flag indicating if application is used in device configuration */
  selected?: boolean;
  /** @description A flag indicating if application version shouldnt be checked */
  skipVersion?: boolean;
};

/** @description A specification of a single configuration file available for usage on mobile device */
export type ConfigurationFileView = {
  /**
   * Format: int64
   * @description A timestamp of file uploading to server (in milliseconds since epoch time)
   */
  lastUpdate?: number;
  /** @description A flag indicating if file is to be removed from the device or not */
  remove?: boolean;
  /** @description A path to a file on device */
  path?: string;
};

/** @description An MDM configuration used on mobile device */
export type ConfigurationView = {
  /** @description A list of applications set and available for for configuration */
  applications?: ApplicationView[];
  /** @description A list of configrration files to be set on device */
  files?: ConfigurationFileView[];
  /** @description A unique name of configuration */
  name?: string;
  /**
   * Format: int32
   * @description A configuration ID
   */
  id?: number;
  /** @description QR code to enroll the configuration */
  qrCodeKey?: string;
};

/** @description A specification of a single application installed and used on mobile device */
export type DeviceApplicationView = {
  /** @description A version of application */
  version?: string;
  /** @description A package ID of application */
  pkg?: string;
};

export type DeviceConfigurationFile = {
  /** @description A path to file on device */
  path?: string;
  /** @description A flag indicating if file is to be removed from the device or not */
  remove?: boolean;
  /**
   * Format: int64
   * @description A timestamp of file uploading to server (in milliseconds since epoch time)
   */
  lastUpdate?: number;
};

/** @description The details related to a single device. Such details are sent from the MDM mobile application to MDM server */
export type DeviceInfoView = {
  /** @description A list of configuration files installed on device */
  files?: DeviceConfigurationFile[];
  /** @description A list of permissions set for device. Contains exactly three elements (each either 0 or 1). */
  permissions?: number[];
  /** @description A name of the device model */
  model?: string;
  /** @description A textual identifier of device within MDM server (e.g. device number) */
  deviceId?: string;
  /** @description An IMEI identifier for device */
  imei?: string;
  /**
   * Format: int32
   * @description A battery level in percents
   */
  batteryLevel?: number;
  /** @description A flag showing if Headwind MDM is set as default launcher on a device */
  defaultLauncher?: boolean;
  /** @description A list of applications installed on device */
  applications?: DeviceApplicationView[];
  /** @description A phone number for device */
  phone?: string;
  /** @description A flag indicating if MDM mode is activated on the device */
  mdmMode?: boolean;
  /** @description A flag indicating if kiosk mode is activated on the device */
  kioskMode?: boolean;
  /** @description Version of Android OS on the device */
  androidVersion?: string;
  /** @description Serial number of the device */
  serial?: string;
};

/** @description The list of devices with configurations lookup */
export type DeviceListView = {
  configurations?: { [key: string]: ConfigurationView };

  devices?: PaginatedDataDeviceView;
};

/** @description A device registered to MDM server and running the MDM mobile application */
export type DeviceView = {
  /**
   * Format: int32
   * @description An ID of device
   */
  id?: number;
  /** @description An unique textual identifier of device */
  number?: string;
  /**
   * @description A color coding the current status of the device
   * @enum {string}
   */
  statusCode?: 'green' | 'red' | 'yellow' | 'brown' | 'grey';
  /** @description A description of device */
  description?: string;
  /** @description A list of groups assigned to device */
  groups?: LookupItem[];
  /** @description An info on device state submitted by device to MDM server */
  info?: DeviceInfoView;
  /**
   * Format: int32
   * @description An ID of configuration for device
   */
  configurationId?: number;
  /**
   * Format: int64
   * @description A date of last synchronization of device state (in milliseconds since epoch time)
   */
  lastUpdate?: number;
  /** @description Old device number, used when the number is changed */
  oldNumber?: string;
  /** @description Custom property #1 */
  custom1?: string;
  /** @description Custom property #2 */
  custom2?: string;
  /** @description Custom property #3 */
  custom3?: string;
  /** @description An IMEI of device as set by the administrator */
  imei?: string;
  /** @description A phone number of device as set by the administrator */
  phone?: string;
  /** @description A public IP of device */
  publicIp?: string;
  /** @description A version number for Launcher application installed on device */
  launcherVersion?: string;
  /** @description A package ID for Launcher application installed on device */
  launcherPkg?: string;
  /** @description A flag indicating if MDM mode is activated on the device */
  mdmMode?: boolean;
  /** @description A flag indicating if kiosk mode is activated on the device */
  kioskMode?: boolean;
  /** @description Version of Android OS on the device */
  androidVersion?: string;
  /**
   * Format: int64
   * @description Date and time of the device enrollment
   */
  enrollTime?: number;
  /** @description Device serial number */
  serial?: string;
};

/** @description Paginated data */
export type PaginatedDataDeviceView = {
  /** @description A list of collection items for a single page */
  items?: DeviceView[];
  /**
   * Format: int64
   * @description A total number of items in collection
   */
  totalItemsCount?: number;
};

/** @description A request for searching the devices */
export type DeviceSearchRequest = {
  /** @description A filter to search devices */
  value?: string;
  /**
   * Format: int32
   * @description An ID of a group to search devices for
   */
  groupId?: number;
  /**
   * Format: int32
   * @description An ID of a configuration to search devices for
   */
  configurationId?: number;
  /**
   * Format: int32
   * @description A number of records per single page of data to be retrieved
   */
  pageSize?: number;
  /**
   * Format: int32
   * @description A number of page of data to be retrieved (1-based)
   */
  pageNum?: number;
  /**
   * @description A column to sort devices list by
   * @enum {string}
   */
  sortBy?:
    | 'STATUS'
    | 'LAST_UPDATE'
    | 'NUMBER'
    | 'IMEI'
    | 'PHONE'
    | 'MODEL'
    | 'PERMISSIONS'
    | 'INSTALLATIONS'
    | 'FILES'
    | 'CONFIGURATION'
    | 'DESCRIPTION'
    | 'GROUP'
    | 'LAUNCHER_VERSION'
    | 'BATTERY_LEVEL'
    | 'DEFAULT_LAUNCHER'
    | 'MDM_MODE'
    | 'KIOSK_MODE'
    | 'ANDROID_VERSION'
    | 'ENROLLMENT_DATE'
    | 'SERIAL'
    | 'PUBLICIP'
    | 'CUSTOM1'
    | 'CUSTOM2'
    | 'CUSTOM3';
  /** @description A direction to sort devices list by */
  sortDir?: string;
  /**
   * Format: date-time
   * @description A timestamp for FROM boundary for filtering the data records by last online dates
   */
  dateFrom?: string;
  /**
   * Format: date-time
   * @description A timestamp for TO boundary for filtering the data records by last online dates
   */
  dateTo?: string;
  /** Format: int64 */
  onlineEarlierMillis?: number;
  /** Format: int64 */
  onlineLaterMillis?: number;
  /**
   * Format: date-time
   * @description A timestamp for FROM boundary for filtering the data records by enrollment dates
   */
  enrollmentDateFrom?: string;
  /**
   * Format: date-time
   * @description A timestamp for TO boundary for filtering the data records by enrollment dates
   */
  enrollmentDateTo?: string;
  /** @description A condition for filtering the data records by mdm mode */
  mdmMode?: boolean;
  /** @description A condition for filtering the data records by kiosk mode */
  kioskMode?: boolean;
  /** @description A filter for Android version */
  androidVersion?: string;
  /** @description A filter for launcher version */
  launcherVersion?: string;
  /**
   * @description A filter for application installation status
   * @enum {string}
   */
  installationStatus?: 'SUCCESS' | 'VERSION_MISMATCH' | 'FAILURE';
  /** @description A filter for recent IMEI change */
  imeiChanged?: boolean;
  /** @description Flag of fast searching by device number */
  fastSearch?: boolean;
  /** Format: int64 */
  dateFromMillis?: number;
  /** Format: int64 */
  dateToMillis?: number;
  /** Format: int64 */
  enrollmentDateFromMillis?: number;
  /** Format: int64 */
  enrollmentDateToMillis?: number;
};

export type DeviceGroupBulkRequest = {
  ids?: number[];
  action?: string;
  groups?: LookupItem[];
};

export type APKFileDetails = {
  pkg?: string;
  version?: string;
  /** Format: int32 */
  versionCode?: number;
  arch?: string;
  name?: string;
};

export type FileUploadResult = {
  serverPath?: string;
  fileDetails?: APKFileDetails;
  application?: Application;
  complete?: boolean;
  exists?: boolean;
  name?: string;
};

/** @description A link between the file and the configuration */
export type FileConfigurationLink = {
  /**
   * Format: int32
   * @description An ID of a link between the file and configuration. May be null if those are not linked
   */
  id?: number;
  /**
   * Format: int32
   * @description An ID of a customer account which both the file and configuration belong to
   */
  customerId?: number;
  /**
   * Format: int32
   * @description An ID of a configuration
   */
  configurationId?: number;
  /** @description A name of a configuration */
  configurationName?: string;
  /**
   * Format: int32
   * @description An ID of a file
   */
  fileId?: number;
  /** @description A name of a file */
  fileName?: string;
  /** @description A flag indicating that file is to be uploaded to device in the configuration */
  upload?: boolean;
  /** @description A flag indicating that file is to be removed from the configuration */
  remove?: boolean;
  /** @description Set by front-end when the configuration needs to be notified about changes */
  notify?: boolean;
};

/** @description A request to setup links between the single file and listed configurations */
export type LinkConfigurationsToFileRequest = {
  /**
   * Format: int32
   * @description An ID of a file  to link configurations to
   */
  fileId?: number;
  /** @description A list of configurations to link to application */
  configurations?: FileConfigurationLink[];
};

/** @description A single file maintained by the MDM server */
export type FileView = {
  /**
   * Format: int32
   * @description Id of the basic UploadedFile object
   */
  id?: number;
  /** @description A path to file including the file name */
  filePath?: string;
  /** @description An optional file description */
  description?: string;
  /** @description An URL of file */
  url?: string;
  /**
   * Format: int64
   * @description File size in bytes
   */
  size?: number;
  /**
   * Format: int64
   * @description Last update time in ms
   */
  uploadTime?: number;
  /** @description File path on the device */
  devicePath?: string;
  /** @description A flag showing whether the file has an external URL */
  external?: boolean;
  /** @description A flag showing whether the file has variable content */
  replaceVariables?: boolean;
  usedByApps?: string[];
  usedByIcons?: string[];
  usedByConfigurations?: string[];
};

/** @description A specification of a single file uploaded to server by client */
export type UploadedFile = {
  /**
   * Format: int32
   * @description An application ID
   */
  id?: number;
  /** @description A path to a file relative to base directory for stored files, including the file name */
  filePath?: string;
  /** @description A description of the file */
  description?: string;
  /**
   * Format: int64
   * @description A timestamp of file uploading (in milliseconds since epoch time), should be equal to the timestamp in the file system
   */
  uploadTime?: number;
  /** @description An optional checksum of the file content */
  checksum?: string;
  url?: string;
  /** @description A path to a file on device (including the file name) */
  devicePath?: string;
  /** @description A flag indicating whether the file is using the external URL instead of being uploaded. */
  external?: boolean;
  /** @description An external URL referencing the content of the file */
  externalUrl?: string;
  /** @description A flag indicating whether the file content must be updated by device-specific values */
  replaceVariables?: boolean;
  tmpPath?: string;
  fileName?: string;
  subdir?: string;
};

/** @description A group of devices */
export type Group = {
  /**
   * Format: int32
   * @description A group ID
   */
  id?: number;
  /** @description A group name */
  name?: string;
};

/** @description A specification of a single icon used to represent an application on mobile device */
export type Icon = {
  /**
   * Format: int32
   * @description An application ID
   */
  id?: number;
  /** @description A name of the icon */
  name?: string;
  /**
   * Format: int32
   * @description An ID of an uploaded file storing the content of the icon
   */
  fileId?: number;
  /** @description The name of an uploaded file storing the content of the icon */
  fileName?: string;
};

/** @description A user account within MDM web application */
export type User = {
  /**
   * Format: int32
   * @description An ID of a user
   */
  id?: number;
  /** @description A username of a user */
  login?: string;
  /** @description An email address of a user */
  email?: string;
  /** @description A name of a user */
  name?: string;
  /** @description A password of a user (Salted SHA1 hash) */
  password?: string;
  /** @description A role assigned to user */
  userRole?: UserRole;
  /** @description Are all devices available to user */
  allDevicesAvailable?: boolean;
  /** @description Are all configs available to user */
  allConfigAvailable?: boolean;
  /** @description Is password reset required */
  passwordReset?: boolean;
  /** @description Authentication token */
  authToken?: string;
  /** @description Password reset token */
  passwordResetToken?: string;
  /** @description Third party authentication data */
  authData?: string;
  /** @description Two-factor authentication secret */
  twoFactorSecret?: string;
  /** @description Is two factor authentication accepted by the user */
  twoFactorAccepted?: boolean;
  /** @description Is two factor authentication needed (a transient parameter, no db entry) */
  twoFactor?: boolean;
  /**
   * Format: int32
   * @description Timeout in seconds for logging out while idle (0 - no logout)
   */
  idleLogout?: number;
  /**
   * Format: int64
   * @description Last time for failed login (to avoid bruteforce attacks)
   */
  lastLoginFail?: number;
  groups?: LookupItem[];
  configurations?: LookupItem[];
  /** @description An old password for user to be used for verification when changing the password */
  oldPassword?: string;
  /** @description A new password to be set for user */
  newPassword?: string;
  superAdmin?: boolean;
};

/** @description A role of user within MDM web application */
export type UserRole = {
  /**
   * Format: int32
   * @description A user role ID
   */
  id?: number;
  /** @description A user role name */
  name?: string;
  /** @description A user role description */
  description?: string;
  /** @description A list of permissions granted to user role */
  permissions?: UserRolePermission[];
};

/** @description A permission to perform desired action which might be granted to user role */
export type UserRolePermission = {
  /**
   * Format: int32
   * @description An ID of the permission
   */
  id?: number;
  /** @description A name of the permission */
  name?: string;
  /** @description A description of the permission */
  description?: string;
};

/** @description Request to send Push messages to specified devices/groups */
export type PushRequest = {
  messageType?: string;
  payload?: string;
  deviceNumbers?: string[];
  groups?: string[];
  broadcast?: boolean;
};

/** @description The settings for single user role at customer level */
export type UserRoleSettings = {
  /**
   * Format: int32
   * @description An ID of a settings record
   */
  id?: number;
  /**
   * Format: int32
   * @description An ID of a user role
   */
  roleId?: number;
  /** @description A flag indicating if Device Status column to be displayed in MDM web application */
  columnDisplayedDeviceStatus?: boolean;
  /** @description A flag indicating if Device Update Date column to be displayed in MDM web application */
  columnDisplayedDeviceDate?: boolean;
  /** @description A flag indicating if Device Nummber column to be displayed in MDM web application */
  columnDisplayedDeviceNumber?: boolean;
  /** @description A flag indicating if Device Model column to be displayed in MDM web application */
  columnDisplayedDeviceModel?: boolean;
  /** @description A flag indicating if Device Permissions column to be displayed in MDM web application */
  columnDisplayedDevicePermissionsStatus?: boolean;
  /** @description A flag indicating if Device Apps column to be displayed in MDM web application */
  columnDisplayedDeviceAppInstallStatus?: boolean;
  /** @description A flag indicating if Device Files column to be displayed in MDM web application */
  columnDisplayedDeviceFilesStatus?: boolean;
  /** @description A flag indicating if Device Configuration column to be displayed in MDM web application */
  columnDisplayedDeviceConfiguration?: boolean;
  /** @description A flag indicating if Device IMEI column to be displayed in MDM web application */
  columnDisplayedDeviceImei?: boolean;
  /** @description A flag indicating if Device Phone column to be displayed in MDM web application */
  columnDisplayedDevicePhone?: boolean;
  /** @description A flag indicating if Device Description column to be displayed in MDM web application */
  columnDisplayedDeviceDesc?: boolean;
  /** @description A flag indicating if Device Group column to be displayed in MDM web application */
  columnDisplayedDeviceGroup?: boolean;
  /** @description A flag indicating if Launcher Version column to be displayed in MDM web application */
  columnDisplayedLauncherVersion?: boolean;
  /** @description A flag indicating if Battery Level column to be displayed in MDM web application */
  columnDisplayedBatteryLevel?: boolean;
  /** @description A flag indicating if the default launcher column to be displayed in MDM web application */
  columnDisplayedDefaultLauncher?: boolean;
  /** @description A flag indicating if MDM mode column to be displayed in MDM web application */
  columnDisplayedMdmMode?: boolean;
  /** @description A flag indicating if kiosk mode column to be displayed in MDM web application */
  columnDisplayedKioskMode?: boolean;
  /** @description A flag indicating if Android version column to be displayed in MDM web application */
  columnDisplayedAndroidVersion?: boolean;
  /** @description A flag indicating if enrollment date column to be displayed in MDM web application */
  columnDisplayedEnrollmentDate?: boolean;
  /** @description A flag indicating if serial number column to be displayed in MDM web application */
  columnDisplayedSerial?: boolean;
  /** @description A flag indicating if public IP address column to be displayed in MDM web application */
  columnDisplayedPublicIp?: boolean;
  /** @description A flag indicating if custom property #1 column must be displayed in the Devices table */
  columnDisplayedCustom1?: boolean;
  /** @description A flag indicating if custom property #2 column must be displayed in the Devices table */
  columnDisplayedCustom2?: boolean;
  /** @description A flag indicating if custom property #3 column must be displayed in the Devices table */
  columnDisplayedCustom3?: boolean;
};

export type SignupCompleteRequest = {
  token?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  description?: string;
  passwd?: string;
};

/** @description Record for the customer self-signup flow */
export type PendingSignup = {
  /**
   * Format: int32
   * @description ID
   */
  id?: number;
  /** Format: int64 */
  signupTime?: number;
  /** @description Customer email */
  email?: string;
  /** @description Customer language (two small letters) */
  language?: string;
  /** @description Customer signup token */
  token?: string;
};

export type ChartItem = {
  stringAttr?: string;
  /** Format: int32 */
  intAttr?: number;
  /** Format: int32 */
  number?: number;
};

export type SummaryResponse = {
  statusSummary?: ChartItem[];
  installSummary?: ChartItem[];
  /** Format: int64 */
  devicesTotal?: number;
  /** Format: int64 */
  devicesEnrolled?: number;
  /** Format: int64 */
  devicesEnrolledLastMonth?: number;
  devicesEnrolledMonthly?: ChartItem[];
  topConfigs?: string[];
  statusOfflineByConfig?: number[];
  statusIdleByConfig?: number[];
  statusOnlineByConfig?: number[];
  appFailureByConfig?: number[];
  appMismatchByConfig?: number[];
  appSuccessByConfig?: number[];
};

export type SyncApplicationInt = {
  name?: string;
  /** Format: int32 */
  id?: number;
  /** @enum {string} */
  type?: 'app' | 'web' | 'intent';
  system?: boolean;
  version?: string;
  pkg?: string;
  url?: string;
  runAfterInstall?: boolean;
  runAtBoot?: boolean;
  icon?: string;
  remove?: boolean;
  showIcon?: boolean;
  useKiosk?: boolean;
  /** Format: int32 */
  code?: number;
  skipVersion?: boolean;
  iconText?: string;
  /** Format: int32 */
  screenOrder?: number;
  /** Format: int32 */
  keyCode?: number;
  intent?: string;
  bottom?: boolean;
  longTap?: boolean;
};

export type SyncApplicationSettingInt = {
  name?: string;
  value?: string;
  /** Format: int32 */
  type?: number;
  /** Format: int64 */
  lastUpdate?: number;
  packageId?: string;
  readonly?: boolean;
};

export type SyncConfigurationFileInt = {
  path?: string;
  description?: string;
  url?: string;
  /** Format: int64 */
  lastUpdate?: number;
  checksum?: string;
  remove?: boolean;
  varContent?: boolean;
};

/** @description The details and settings for a single device used for configuring MDM mobile application */
export type SyncResponse = {
  /** @description A background color to use when running MDM application */
  backgroundColor?: string;
  /** @description A text color to use when running MDM application */
  textColor?: string;
  /** @description An URL for background image to use when running MDM application */
  backgroundImageUrl?: string;
  /** @description A size of the icons to use when running MDM application */
  iconSize?: string;
  /** @description A type of location tracking */
  requestUpdates?: string;
  /** @description A flag indicating if location permission shouldn't be granted */
  disableLocation?: boolean;
  /** @description Strategy of app permission auto-granting */
  appPermissions?: string;
  /** @description Push notification options */
  pushOptions?: string;
  /**
   * Format: int32
   * @description Keep-Alive time for MQTT connection
   */
  keepaliveTime?: number;
  /** @description Brightness management option */
  autoBrightness?: boolean;
  /**
   * Format: int32
   * @description Brightness value (0-255)
   */
  brightness?: number;
  /** @description Timeout management option */
  manageTimeout?: boolean;
  /**
   * Format: int32
   * @description Timeout value (sec)
   */
  timeout?: number;
  /** @description Volume lock option */
  lockVolume?: boolean;
  /** @description Volume manage option */
  manageVolume?: boolean;
  /**
   * Format: int32
   * @description Volume (percents)
   */
  volume?: number;
  /** @description Password requirements for the mobile device */
  passwordMode?: string;
  /**
   * Format: int32
   * @description Orientation lock: 0 - none, 1 - portrait, 2 - landscape
   */
  orientation?: number;
  /** @description Set to true if Headind MDM should display device status (time, battery, etc) */
  displayStatus?: boolean;
  /** @description Set to true if Headwind MDM need to work together with a third-party launcher */
  runDefaultLauncher?: boolean;
  /** @description Flag indicating if screenshots are disabled on the device */
  disableScreenshots?: boolean;
  /** @description Flag indicating if autostarted apps should be kept in the foreground */
  autostartForeground?: boolean;
  /** @description Time zone settings: null for using default settings, auto for automatic time zone, or Olson time zone string */
  timeZone?: string;
  /** @description Allowed classes, separated by comma */
  allowedClasses?: string;
  /** @description New server URL used to migrate to another server */
  newServerUrl?: string;
  /** @description Flag disabling safe settings */
  lockSafeSettings?: boolean;
  /** @description Flag enabling permissive mode */
  permissive?: boolean;
  /** @description Flag enabling the kiosk exit button */
  kioskExit?: boolean;
  /** @description Show WiFi settings if there's a connection error, also in Kiosk mode */
  showWifi?: boolean;
  /** @description A password for administrator of MDM application used on device */
  password?: string;
  /** @description An IMEI of device */
  imei?: string;
  /** @description A phone number of device */
  phone?: string;
  /** @description A displayed title of the MDM application used on device */
  title?: string;
  /** @description A list of applications to be used on device */
  applications?: SyncApplicationInt[];
  /** @description A flag indicating if GPS is enabled on device */
  gps?: boolean;
  /** @description A flag indicating if Bluetooth is enabled on device */
  bluetooth?: boolean;
  /** @description A flag indicating if Wi-Fi is enabled on device */
  wifi?: boolean;
  /** @description A flag indicating if Mobile Data is enabled on device */
  mobileData?: boolean;
  /** @description A flag indicating if USB storage is enabled on device */
  usbStorage?: boolean;
  /** @description A flag indicating if MDM is operating in kiosk mode */
  kioskMode?: boolean;
  /** @description Flag enabling Home button in kiosk mode */
  kioskHome?: boolean;
  /** @description Flag enabling Recents button in kiosk mode */
  kioskRecents?: boolean;
  /** @description Flag enabling notifications in kiosk mode */
  kioskNotifications?: boolean;
  /** @description Flag enabling system info in kiosk mode */
  kioskSystemInfo?: boolean;
  /** @description Flag enabling lock screen in kiosk mode */
  kioskKeyguard?: boolean;
  /** @description Flag disabling power button in kiosk mode */
  kioskLockButtons?: boolean;
  /** @description A flag indicating if status bar is locked */
  lockStatusBar?: boolean;
  /** @description Flag forcing screen to be on in kiosk mode */
  kioskScreenOn?: boolean;
  /** @description A package ID for the main application */
  mainApp?: string;
  /**
   * Format: int32
   * @description A system update type. 0-Default, 1-Immediately, 2-Scheduled, 3-Postponed
   * @enum {integer}
   */
  systemUpdateType?: 0 | 1 | 2 | 3;
  /** @description A start time for system update period formatted as HH:MM. (If system update time is 2) */
  systemUpdateFrom?: string;
  /** @description A finish time for system update period formatted as HH:MM. (If system update time is 2) */
  systemUpdateTo?: string;
  /** @description A flag indicating if the application update must be scheduled */
  scheduleAppUpdate?: boolean;
  /** @description A start time for app update period formatted as HH:MM. */
  appUpdateFrom?: string;
  /** @description A finish time for app update period formatted as HH:MM. */
  appUpdateTo?: string;
  /** @description Limitations of downloading updates */
  downloadUpdates?: string;
  /** @description A list of application settings to apply on device */
  applicationSettings?: SyncApplicationSettingInt[];
  /** @description A list of files to apply on device */
  files?: SyncConfigurationFileInt[];
  /** @description New device number, used for changing the device number */
  newNumber?: string;
  /** @description List of additional restrictions in MDM mode */
  restrictions?: string;
  /** @description Custom property #1 if it is being sent to device */
  custom1?: string;
  /** @description Custom property #2 if it is being sent to device */
  custom2?: string;
  /** @description Custom property #3 if it is being sent to device */
  custom3?: string;
  appName?: string;
  vendor?: string;
  description?: string;
};

/** @description A single setting for an application installed and used on mobile device and used in data sycnhronization between mobile device and server application */
export type SyncApplicationSetting = {
  /** @description A package of the application */
  packageId: string;
  /** @description A name of the setting */
  name: string;
  /**
   * Format: int32
   * @description A type of the application setting. 1 - String, 2 - Integer, 3 - Boolean
   * @enum {integer}
   */
  type: 1 | 2 | 3;
  /** @description A value of the setting */
  value?: string;
  /** @description A flag indicating if setting can not be modified on device */
  readonly: boolean;
  /**
   * Format: int64
   * @description A timestamp of the last update of the setting (in milliseconds since epoch time
   */
  lastUpdate?: number;
};

/** @description A JWT token identifying a single client of the application */
export type JWTToken = {
  /** @description A token value */
  id_token?: string;
};

/** @description The credentials to be used for authenticating the user to application */
export type UserCredentials = {
  /** @description A username to be used for authentication */
  login?: string;
  /** @description A password to be used for authentication (MD5-hash) */
  password?: string;
};
