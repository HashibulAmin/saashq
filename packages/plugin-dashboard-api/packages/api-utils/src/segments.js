"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gatherAssociatedTypes = exports.gatherDependentServicesType = exports.getEsIndexByContentType = exports.getServiceName = exports.getName = void 0;
const serviceDiscovery_1 = require("./serviceDiscovery");
const getName = (type) => type.split(':')[1];
exports.getName = getName;
const getServiceName = (type) => type.split(':')[0];
exports.getServiceName = getServiceName;
const getEsIndexByContentType = async (contentType) => {
    const [serviceName, type] = contentType.split(':');
    const service = await (0, serviceDiscovery_1.getService)(serviceName, true);
    const segmentMeta = (service.config.meta || {}).segments;
    if (segmentMeta) {
        const { contentTypes } = segmentMeta;
        for (const ct of contentTypes) {
            if (ct.type === type && ct.esIndex) {
                return ct.esIndex;
            }
        }
    }
    return '';
};
exports.getEsIndexByContentType = getEsIndexByContentType;
const gatherDependentServicesType = async (serviceName, gatherTypes) => {
    const serviceNames = await (0, serviceDiscovery_1.getServices)();
    for (const sName of serviceNames) {
        const service = await (0, serviceDiscovery_1.getService)(sName, true);
        const segmentMeta = (service.config.meta || {}).segments;
        if (!segmentMeta) {
            continue;
        }
        const dependentServices = segmentMeta.dependentServices || [];
        const contentTypes = segmentMeta.contentTypes || [];
        for (const dService of dependentServices) {
            if (dService.name !== serviceName || !dService.twoWay) {
                continue;
            }
            for (const contentType of contentTypes) {
                gatherTypes(contentType, sName, dService);
            }
        }
    }
};
exports.gatherDependentServicesType = gatherDependentServicesType;
const gatherAssociatedTypes = async (contentType) => {
    const [serviceName, currentType] = contentType.split(':');
    const service = await (0, serviceDiscovery_1.getService)(serviceName, true);
    const segmentMeta = (service.config.meta || {}).segments;
    const associatedTypes = [];
    if (segmentMeta) {
        const { contentTypes } = segmentMeta;
        // gather current services associatedTypes
        for (const ct of contentTypes) {
            if (ct.type !== currentType && !ct.notAssociated) {
                associatedTypes.push(`${serviceName}:${ct.type}`);
            }
        }
        // gather current services dependentServices associatedTypes
        if (segmentMeta.dependentServices) {
            const dependentServices = segmentMeta.dependentServices || [];
            for (const dependentService of dependentServices) {
                if (!dependentService.associated) {
                    continue;
                }
                await gatherServicesAssociatedTypes(dependentService.name, associatedTypes);
            }
        }
    }
    // gather current services dependentServices associatedTypes
    await (0, exports.gatherDependentServicesType)(serviceName, (ct, sName, depService) => {
        if (!depService.associated || ct.notAssociated) {
            return;
        }
        associatedTypes.push(`${sName}:${ct.type}`);
    });
    return associatedTypes;
};
exports.gatherAssociatedTypes = gatherAssociatedTypes;
const gatherServicesAssociatedTypes = async (serviceName, associatedTypes) => {
    const service = await (0, serviceDiscovery_1.getService)(serviceName, true);
    const segmentMeta = (service.config.meta || {}).segments;
    if (!segmentMeta) {
        return;
    }
    const contentTypes = segmentMeta.contentTypes || [];
    for (const contentType of contentTypes) {
        if (contentType.notAssociated) {
            continue;
        }
        associatedTypes.push(`${serviceName}:${contentType.type}`);
    }
};
