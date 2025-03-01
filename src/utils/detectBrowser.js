import DeviceDetector from "device-detector-js";

export const getUserDeviceInfo = () => {
  const deviceDetector = new DeviceDetector();
  const userAgent = navigator.userAgent;
  const device = deviceDetector.parse(userAgent);

  return {
    browser: device.client?.name || "Unknown",
    deviceType: device.device?.type || "Unknown",
  };
};
