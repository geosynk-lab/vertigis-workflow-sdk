import * as React from "react";
import type { FormElementRegistration } from "@vertigis/workflow";
import { Box, TextField, Typography } from "@mui/material";
import { tokens } from "../../tokens";
import { FormElementErrorBoundary } from "./components/FormElementErrorBoundary";
import type { SampleFormElementProps } from "./types";

function extractText(val: unknown, fallback: string = ""): string {
    if (typeof val === "string") return val;
    if (val && typeof val === "object" && "markdown" in val && typeof (val as { markdown: unknown }).markdown === "string") {
        return (val as { markdown: string }).markdown;
    }
    return fallback;
}

function SampleFormElementView(props: SampleFormElementProps): React.ReactElement {
    const {
        value = "",
        setValue,
        setProperty,
        label,
        placeholder = "Enter inspection observation...",
        enabled = true,
        readOnly = false,
        error,
    } = props;

    const displayLabel = extractText(label, "Site Inspection Field");
    const displayError = error ? extractText(error, "Invalid inspection value") : undefined;

    const handleChange = (newVal: string) => {
        setValue(newVal);
        setProperty("error", newVal.length > 0 && newVal.length < 6 ? "Minimum 6 characters required" : undefined);
    };

    return (
        <Box
            sx={{
                p: 2,
                backgroundColor: tokens.ui.surface.secondary,
                border: `1px solid ${displayError ? tokens.ui.status.errorBorder : tokens.ui.border.primary}`,
                borderRadius: tokens.ui.shape.borderRadius,
                boxShadow: tokens.ui.shape.shadowPrimary,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
            }}
        >
            <Box>
                <Typography
                    variant="subtitle1"
                    sx={{
                        color: tokens.ui.text.primary,
                        fontFamily: tokens.typography.fontFamily.primary,
                        fontWeight: tokens.typography.fontWeight.semibold,
                    }}
                >
                    {displayLabel}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: tokens.ui.text.secondary,
                        fontFamily: tokens.typography.fontFamily.primary,
                    }}
                >
                    Changes persist across workflow form tabs.
                </Typography>
            </Box>

            <TextField
                fullWidth
                variant="outlined"
                placeholder={placeholder}
                value={value ?? ""}
                disabled={!enabled}
                error={Boolean(displayError)}
                helperText={
                    <Typography
                        variant="caption"
                        sx={{
                            color: displayError
                                ? tokens.ui.status.errorFg
                                : !enabled
                                ? tokens.ui.text.disabled
                                : tokens.ui.text.secondary,
                        }}
                    >
                        {displayError ?? "Required minimum 6 characters for valid inspection record."}
                    </Typography>
                }
                inputProps={{
                    readOnly,
                    "aria-label": displayLabel,
                    style: { minHeight: "24px" },
                }}
                onChange={(e) => handleChange(e.currentTarget.value)}
                sx={{
                    backgroundColor: readOnly ? tokens.ui.surface.secondary : tokens.ui.surface.primary,
                    borderRadius: tokens.ui.shape.borderRadius,
                    "& .MuiInputBase-root": {
                        minHeight: tokens.ui.touch.minHeight,
                    },
                    "& .MuiInputBase-input": {
                        color: !enabled ? tokens.ui.text.disabled : tokens.ui.text.primary,
                        fontFamily: tokens.typography.fontFamily.primary,
                        fontSize: tokens.typography.fontSize.body2,
                    },
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: displayError ? tokens.ui.status.errorBorder : tokens.ui.border.primary },
                        "&:hover fieldset": { borderColor: tokens.ui.accent.primary },
                        "&.Mui-focused fieldset": { borderColor: tokens.ui.accent.primary },
                    },
                }}
            />
        </Box>
    );
}

export function SampleFormElement(props: SampleFormElementProps): React.ReactElement {
    return (
        <FormElementErrorBoundary>
            <SampleFormElementView {...props} />
        </FormElementErrorBoundary>
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
