import { Cols75x25 } from '@wpsocio/components';
import { Form, useForm, yupResolver } from '@wpsocio/form';
import { SubmitBar } from '@wpsocio/form-components';
import { useMemo } from 'react';
import { ROOT_ID } from '../constants';
import {
	prepDefaultValues,
	useData,
	useInit,
	useOnInvalid,
	useOnSubmit,
	validationSchema,
} from '../services';
import { Configuration } from './Configuration';
import { Header } from './Header';
import { Instructions } from './Instructions';
import Sidebar from './Sidebar';

const resolver = yupResolver(validationSchema);

const App: React.FC = () => {
	useInit();

	const { savedSettings } = useData();

	const defaultValues = useMemo(
		() => prepDefaultValues(savedSettings),
		[savedSettings],
	);

	const form = useForm({ defaultValues, resolver, mode: 'onBlur' });

	const onSubmit = useOnSubmit(form);

	const onInvalid = useOnInvalid();

	const leftCol = (
		<>
			<Header />
			<Instructions />
			<Configuration />
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
