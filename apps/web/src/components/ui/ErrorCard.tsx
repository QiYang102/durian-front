import { Icon } from "./Icon";
import { Text } from "./Text";

export const ErrorCard = ({ errors }: { errors: object }) => {
  return (
    <div className="rounded-xl border border-red-600 bg-red-100 p-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-start">
          <Icon name="alert-circle" color="danger" size="md" className="mr-2" />
          <Text color="danger">Error</Text>
        </div>
        {/* show all the error in the dictionary */}
        {Object.keys(errors).length > 0 && (
          <ul>
            {Object.entries(errors).map(([field, { message }]) => (
              <li key={field} className="text-red-500">{`${message}`}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
