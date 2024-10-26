import { Form, useForm, zodResolver } from '@wpsocio/form';
import { WpAdminContainer } from '@wpsocio/shared-ui/components/wp-admin-container.js';
import { SubmitBar } from '@wpsocio/shared-ui/form/submit/submit-bar.js';
import { ROOT_ID } from '../constants';
import {
	getDomData,
	prepDefaultValues,
	useInit,
	useOnInvalid,
	useOnSubmit,
	validationSchema,
} from '../services';
import { Configuration } from './Configuration';
import { Header } from './Header';
import { Instructions } from './Instructions';
import Sidebar from './Sidebar';

const resolver = zodResolver(validationSchema);

const defaultValues = prepDefaultValues(getDomData().savedSettings);

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
				<Instructions />
				<Configuration />
				<SubmitBar form={`${ROOT_ID}-form`} />
			</WpAdminContainer>
		</Form>
	);
};

export default App;
