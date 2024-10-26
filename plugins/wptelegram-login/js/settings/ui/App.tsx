import { Form, useForm, zodResolver } from '@wpsocio/form';
import { WpAdminContainer } from '@wpsocio/shared-ui/components/wp-admin-container.js';
import { SubmitBar } from '@wpsocio/shared-ui/form/submit/submit-bar.js';
import { ROOT_ID } from '../constants';
import { getDomData, validationSchema } from '../services';
import { useInit, useOnInvalid, useOnSubmit } from '../services';
import { ButtonOptions } from './ButtonOptions';
import { ErrorMessageOptions } from './ErrorMessageOptions';
import { Header } from './Header';
import { Instructions } from './Instructions';
import { LoginOptions } from './LoginOptions';
import { Sidebar } from './Sidebar';
import { TelegramOptions } from './TelegramOptions';

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
				<Instructions />
				<TelegramOptions />
				<LoginOptions />
				<ButtonOptions />
				<ErrorMessageOptions />
				<SubmitBar form={`${ROOT_ID}-form`} />
			</WpAdminContainer>
		</Form>
	);
};

export default App;
