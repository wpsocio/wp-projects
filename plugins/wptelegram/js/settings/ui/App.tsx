import { Cols75x25 } from '@wpsocio/components';
import { Form, useForm, yupResolver } from '@wpsocio/form';
import { SubmitBar } from '@wpsocio/form-components';
import { useMemo } from 'react';
import { ROOT_ID } from '../constants';
import { DataShape, useData, validationSchema } from '../services';
import {
	prepDefaultValues,
	useInit,
	useOnInvalid,
	useOnSubmit,
} from '../services';
import { Header } from './Header';
import Sidebar from './Sidebar';
import { TabbedSections } from './TabbedSections';
import { Upsell } from './shared/Upsell';

const resolver = yupResolver(validationSchema);

const App: React.FC = () => {
	useInit();

	const { savedSettings } = useData();

	const defaultValues = useMemo(
		() => prepDefaultValues(savedSettings),
		[savedSettings],
	);

	const form = useForm<DataShape>({ defaultValues, resolver, mode: 'onBlur' });

	const onSubmit = useOnSubmit(form);

	const onInvalid = useOnInvalid();

	const leftCol = (
		<>
			<Header />
			<Upsell location="header" />
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
