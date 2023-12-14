import { Columns, ColumnsProps } from './Columns';

export const Cols60x40: React.FC<ColumnsProps> = (props) => {
	return <Columns leftColWidth='60%' rightColWidth='40%' {...props} />;
};
