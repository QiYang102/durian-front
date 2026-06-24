import type { FunctionComponent } from "react";

interface DebugProps {
	data: any;
}

export const Debug: FunctionComponent<DebugProps> = ({ data }) => {
	if (process.env.NODE_ENV === "production") return null;

	return <pre className="text-sm italic">{JSON.stringify(data, null, 2)}</pre>;
};
