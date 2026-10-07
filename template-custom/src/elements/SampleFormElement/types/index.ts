import type { FormElementProps } from "@vertigis/workflow";

export interface SampleFormElementProps extends FormElementProps<string> {
    placeholder?: string;
    /** Hidden elements render nothing (FORM_PROPS_WIRING). */
    visible?: boolean;
}
