import { pki } from 'node-forge';
export declare function generateCertificatesArray(certChain: string): pki.Certificate[];
/**
 * Function used to generate ca store based on input root CAs list
 * @param {string[]} certs root CAs in pem format
 */
export declare function generateCAStore(certs: string[]): pki.CAStore;
