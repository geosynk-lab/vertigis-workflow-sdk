import * as React from "react";
import type { FormElementRegistration } from "@vertigis/workflow";
import { Paper, Stack, TextField, Typography } from "@mui/material";
import { tokens } from "../../tokens";
import { VertiGisThemeProvider } from "../../tokens/VertiGisThemeProvider";
import { FormElementErrorBoundary } from "./components/FormElementErrorBoundary";
import type { SampleFormElementProps } from "./types";

function extractText(val: unknown, fallback: string = ""): string {
    if (typeof val === "string") return val;
    if (val && typeof val === "object" && "markdown" in val && typeof (val as { markdown: unknown }).markdown === "string") {
        return (val as { markdown: string }).markdown;
    }
    return fallback;
}

function SampleFormElementView(props: SampleFormElementProps): React.ReactElement | null {
    const {
        value = "",
        setValue,
        setProperty,
        label,
        placeholder = "Enter inspection observation...",
        enabled = true,
        readOnly = false,
        visible = true,
        error,
    } = props;

    const displayLabel = extractText(label, "Site Inspection Field");
    const displayError = error ? extractText(error, "Invalid inspection value") : undefined;

    const handleChange = (newVal: string) => {
        setValue(newVal);
        setProperty("error", newVal.length > 0 && newVal.length < 6 ? "Minimum 6 characters required" : undefined);
    };

    if (!visible) return null;

    return (
        <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1.5}>
                <Stack spacing={0.5}>
                    <Typography variant="subtitle1">{displayLabel}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Changes persist across workflow form tabs.
                    </Typography>
                </Stack>
                <TextField
                    fullWidth
                    placeholder={placeholder}
                    value={value ?? ""}
                    disabled={!enabled}
                    error={Boolean(displayError)}
                    helperText={displayError ?? "Required minimum 6 characters for valid inspection record."}
                    slotProps={{ htmlInput: { readOnly, "aria-label": displayLabel } }}
                    onChange={(e) => handleChange(e.currentTarget.value)}
                    sx={{ "& .MuiInputBase-root": { minHeight: tokens.ui.touch.minHeight } }}
                />
            </Stack>
        </Paper>
    );
}

export function SampleFormElement(props: SampleFormElementProps): React.ReactElement {
    return (
        <VertiGisThemeProvider>
            <FormElementErrorBoundary>
                <SampleFormElementView {...props} />
            </FormElementErrorBoundary>
        </VertiGisThemeProvider>
    );
}

const SampleFormElementRegistration: FormElementRegistration<SampleFormElementProps> = {
    component: SampleFormElement,
    id: "SampleFormElement",
    getInitialProperties: () => ({
        value: "",
        enabled: true,
        label: "Site Inspection Field",
    }),
};

export default SampleFormElementRegistration;
