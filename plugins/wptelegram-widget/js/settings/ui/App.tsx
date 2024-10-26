import { Form, useForm, zodResolver } from '@wpsocio/form';
import { WpAdminContainer } from '@wpsocio/shared-ui/components/wp-admin-container.js';
import { SubmitBar } from '@wpsocio/shared-ui/form/submit/submit-bar.js';
import { ROOT_ID } from '../constants';
import {
	getDomData,
	useInit,
	useOnInvalid,
	useOnSubmit,
	validationSchema,
} from '../services';
import { Header } from './Header';
import Sidebar from './Sidebar';
import { TabbedSections } from './TabbedSections';

const resolver = zodResolver(validationSchema);

const { savedSettings: defaultValues } = getDomData();

const App: React.FC = () => {
	useInit();

	const form = useForm({ defaultValues, resolver, mode: 'onBlur' });

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
				<TabbedSections />
				<SubmitBar form={`${ROOT_ID}-form`} showSeparator={false} />
			</WpAdminContainer>
		</Form>
	);
};

export default App;
