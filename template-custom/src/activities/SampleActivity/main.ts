import type { IActivityHandler } from "@vertigis/workflow";

export interface SampleActivityInputs {
    /**
     * @displayName Sample Text Input
     * @description Text to be processed by the activity.
     * @required
     */
    textInput: string;

    /**
     * @displayName Run Activity
     * @description Whether to run this activity. Defaults to true.
     */
    runActivity?: boolean;

    /**
     * @displayName Show Logger
     * @description Output debug messages to browser console.
     */
    showLogger?: boolean;
}

export interface SampleActivityOutputs {
    /**
     * @description The processed result string.
     */
    result: string;
}

/**
 * @displayName Sample Activity
 * @defaultName SampleActivity
 * @category Enterprise Utilities
 * @description Demonstrates defensive execution and structured error handling.
 * @clientOnly
 * @supportedApps VSW, EXB
 */
export default class SampleActivity implements IActivityHandler {
    async execute(inputs: SampleActivityInputs): Promise<SampleActivityOutputs> {
        const { showLogger = false } = inputs;
        const runActivity = inputs.runActivity !== undefined ? inputs.runActivity : true;

        if (!runActivity) {
            if (showLogger) console.log("SampleActivity bypassed.");
            return { result: "" };
        }

        try {
            if (!inputs.textInput) {
                throw new Error("textInput is required");
            }
            if (showLogger) {
                console.log("SampleActivity processing:", inputs.textInput);
            }
            return { result: `Processed: ${inputs.textInput}` };
        } catch (error: any) {
            throw new Error(`SampleActivity failure: ${error?.message || "Unknown error"}`);
        }
    }
}
