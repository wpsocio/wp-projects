import { Form, useForm, zodResolver } from '@wpsocio/form';
import { WpAdminContainer } from '@wpsocio/shared-ui/components/wp-admin-container.js';
import { SubmitBar } from '@wpsocio/shared-ui/form/submit/submit-bar.js';
import { useMemo } from 'react';
import { ROOT_ID } from '../constants';
import { type DataShape, validationSchema } from '../services/fields';
import { useData } from '../services/useData';
import { useInit } from '../services/useInit';
import { useOnInvalid } from '../services/useOnInvalid';
import { useOnSubmit } from '../services/useOnSubmit';
import { prepDefaultValues } from '../services/utils';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { TabbedSections } from './TabbedSections';
import { Upsell } from './shared/pro-upsell.js';

const resolver = zodResolver(validationSchema);

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

	return (
		<Form
			id={`${ROOT_ID}-form`}
			onSubmit={form.handleSubmit(onSubmit, onInvalid)}
			form={form}
		>
			<WpAdminContainer sidebar={<Sidebar />}>
				<Header />
				<Upsell location="header" />
				<TabbedSections />
				<SubmitBar form={`${ROOT_ID}-form`} />
			</WpAdminContainer>
		</Form>
	);
};

export default App;
