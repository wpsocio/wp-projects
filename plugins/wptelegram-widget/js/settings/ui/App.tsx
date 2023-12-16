import { Cols75x25 } from '@wpsocio/components';
import { Form, useForm, yupResolver } from '@wpsocio/form';
import { SubmitBar } from '@wpsocio/form-components';
import { ROOT_ID } from '../constants';
import {
	useData,
	useInit,
	useOnInvalid,
	useOnSubmit,
	validationSchema,
} from '../services';
import { Header } from './Header';
import Sidebar from './Sidebar';
import { TabbedSections } from './TabbedSections';

const resolver = yupResolver(validationSchema);

const App: React.FC = () => {
	useInit();

	const { savedSettings: defaultValues } = useData();

	const form = useForm({ defaultValues, resolver, mode: 'onBlur' });

	const onSubmit = useOnSubmit(form);

	const onInvalid = useOnInvalid();

	const leftCol = (
		<>
			<Header />
			<TabbedSections />
			<SubmitBar form={`${ROOT_ID}-form`} />
		</>
	);
	const rightCol = <Sidebar />;

	return (
		<Form
			id={`${ROOT_ID}-form`}
			onSubmit={form.handleSubmit(onSubmit, onInvalid)}
			form={form}
		>
			<Cols75x25 leftCol={leftCol} rightCol={rightCol} />
		</Form>
	);
};

export default App;
