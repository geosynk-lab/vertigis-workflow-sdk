import * as React from "react";
import { Box, Typography, Button } from "@mui/material";
import { tokens } from "../../../tokens";

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    errorMessage: string;
}

export class FormElementErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, errorMessage: "" };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, errorMessage: error?.message || "Unknown error" };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error("FormElement error:", error, errorInfo);
    }

    handleRetry = (): void => {
        this.setState({ hasError: false, errorMessage: "" });
    };

    render(): React.ReactNode {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        p: 2,
                        backgroundColor: tokens.ui.status.errorBg,
                        border: `1px solid ${tokens.ui.status.errorBorder}`,
                        borderRadius: tokens.ui.shape.borderRadius,
                    }}
                >
                    <Typography variant="subtitle2" sx={{ color: tokens.ui.status.errorFg, fontWeight: "bold" }}>
                        Form Element Error
                    </Typography>
                    <Typography variant="caption" sx={{ color: tokens.ui.text.primary, display: "block", my: 1 }}>
                        {this.state.errorMessage}
                    </Typography>
                    <Button size="small" variant="outlined" onClick={this.handleRetry}>
                        Retry Element
                    </Button>
                </Box>
            );
        }
        return this.props.children;
    }
}
