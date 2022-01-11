/// <reference types="node" />
import { IncomingHttpHeaders } from 'http';
/**
 * Provide constant value
 * For more info, check `link <https://developer.amazon.com/docs/custom-skills/host-a-custom-skill-as-a-web-service.html#checking-the-signature-of-the-request>
 */
export declare const REQUIRED_NODE_VERSION = "12.3.0";
/**
 * Verifiers are run against incoming requests to verify authenticity and integrity of the request before processing
 * it.
 */
export interface Verifier {
    /**
     * Verifies an incoming request.
     *
     * @param {string} requestEnvelope The request body in string format
     * @param {IncomingHttpHeaders} headers The request headers
     */
    verify(requestEnvelope: string, headers?: IncomingHttpHeaders): Promise<void | string>;
}
/**
 * Implementation of Verifier which provides a utility method to verify the signature of a skill request.
 */
export declare class SkillRequestSignatureVerifier implements Verifier {
    protected certCache: Map<string, string>;
    constructor();
    /**
     * Verifies the certificate authenticity.
     *
     * This verifier uses the crypto module pki functions to validate the signature chain in the input request.
     * The verification follows the mechanism explained here :
     * https://developer.amazon.com/docs/custom-skills/host-a-custom-skill-as-a-web-service.html#checking-the-signature-of-the-request
     * @param {string} requestEnvelope Request body of the input POST request in string format
     * @param {IncomingHttpHeaders} headers Headers of the input POST request
     */
    verify(requestEnvelope: string, headers: IncomingHttpHeaders): Promise<void>;
    /**
     *  Validate Url and retrieve certificate chain
     *
     *  This method validates if the URL is valid and loads
     *  the certificate chain, before returning it.
     * @private
     * @param {string} signatureCertChainUrl URL for retrieving certificate chain
     * @return {Promise<string>}
     */
    private _validateUrlAndRetrieveCertChain;
    /**
     * Validate the URL containing the certificate chain
     *
     * This method validates if the URL provided adheres to the format mentioned here :
     * https://developer.amazon.com/docs/custom-skills/host-a-custom-skill-as-a-web-service.html#cert-verify-signature-certificate-url
     * @private
     * @param {string} signatureCertChainUrl URL for retrieving certificate chain
     */
    private _validateCertificateUrl;
    /**
     * Load certificate chain
     *
     * This method loads the certificate chain from the certificate
     * cache. If there is a cache miss, the certificate chain is
     * loaded from the certificate URL. If certificate chain is
     * loaded from URL, validate it before return.
     * @private
     * @param {string} signatureCertChainUrl URL for retrieving certificate chain
     * @return {Promise<string>}
     */
    private _loadCertChain;
    /**
     * Loads the certificate chain from the URL.
     *
     * This method use the validated certificate url to retrieve certificate chain
     * @private
     * @param {string} signatureCertChainUrl URL for retrieving certificate chain
     * @return {Promise<string>}
     */
    private _getCertChainByUrl;
    /**
     * Validate certificate chain
     *
     * This method uses the crypto module pki functions to validate the signature chain
     * It checks if the passed in certificate chain is valid,
     * i.e it is not expired and the Alexa domain is present in the
     * SAN extensions of the certificate chain.
     * @private
     * @param {string} pemCert Certificate chain in pem format
     */
    private _validateCertChain;
    /**
     * Validate the request body hash with signature
     *
     * This method checks if the hash value of the request body
     * matches with the hash value of the signature
     * @param pemCert Certificate chain in pem format
     * @param signature Encrypted signature of the request
     * @param requestEnvelope Request body of the input POST request in string format
     */
    private _validateRequestBody;
}
/**
 * Implementation of Verifier which provides a utility method to handle
 * the request timestamp verification of the input request.
 */
export declare class TimestampVerifier implements Verifier {
    protected toleranceInMillis: number;
    constructor(tolerance?: number);
    /**
     * Verifies the certificate authenticity.
     *
     * The verify method retrieves the request timestamp and check if
     * it falls in the limit set by the tolerance, by checking with
     * the current timestamp. The verification follows the mechanism explained here :
     * https://developer.amazon.com/docs/custom-skills/host-a-custom-skill-as-a-web-service.html#checking-the-signature-of-the-request
     * @param {string} requestEnvelope Request envelope of the input POST request in string format
     * @return {Promise<void>}
     */
    verify(requestEnvelope: string): Promise<void>;
}
