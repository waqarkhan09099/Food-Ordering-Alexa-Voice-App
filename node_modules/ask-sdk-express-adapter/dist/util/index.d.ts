/// <reference types="node" />
import { Skill } from 'ask-sdk-core';
import { ResponseEnvelope } from 'ask-sdk-model';
import { IncomingHttpHeaders } from 'http';
import { Verifier } from '../verifier';
/**
 * Verify request and dispatch
 *
 * This method first validate request with all provided verifiers
 * Then, invoke the skill to handle request envelope to get response
 * @param {IncomingHttpHeaders} httpRequestHeader Http request header
 * @param {string} httpRequestBody Http request body in string format
 * @param {Skill} skill ask-sdk-core custom skill instance
 * @param {Verifier[]} verifiers Array of user customized Verifier instances
 */
export declare function asyncVerifyRequestAndDispatch(httpRequestHeader: IncomingHttpHeaders, httpRequestBody: string, skill: Skill, verifiers: Verifier[]): Promise<ResponseEnvelope>;
