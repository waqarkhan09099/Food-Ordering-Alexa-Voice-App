import { Skill } from 'ask-sdk-core';
import { RequestHandler } from 'express';
import { Verifier } from '../verifier';
/**
 * Express adapter class
 */
export declare class ExpressAdapter {
    protected skill: Skill;
    protected verifiers: Verifier[];
    /**
     * Constructor
     *
     * @param {Skill} skill ask-sdk-core custom skill instance
     * @param {boolean} verifySignature boolean flag decide if certificate signature verifier is needed
     * @param {boolean} verifyTimeStamp boolean flag decide if timestamp verifier is needed
     * @param {Verifier[]} verifiers Array of user customized Verifier instances
     */
    constructor(skill: Skill, verifySignature?: boolean, verifyTimeStamp?: boolean, verifiers?: Verifier[]);
    /**
     * Get pre-defined request handlers
     *
     * This function return an array of pre-defined request handlers
     * which are supposed to be registered on users' express application, including:
     * 1: text parser 2: async function to get response envelope after verification, then send result back
     * Example usage: app.post('/', new ExpressAdapter(skill).getASKRequestHandler());
     */
    getRequestHandlers(): RequestHandler[];
}
