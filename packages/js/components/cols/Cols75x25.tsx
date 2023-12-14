import { Columns, ColumnsProps } from './Columns';

export const Cols75x25: React.FC<ColumnsProps> = (props) => {
	return <Columns leftColWidth='75%' rightColWidth='25%' {...props} />;
};
