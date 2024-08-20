import { Form, useForm, zodResolver } from '@wpsocio/form';
import { SubmitBar } from '@wpsocio/shared-ui/form/submit/submit-bar.js';
import { ROOT_ID } from '../constants';
import { useData, validationSchema } from '../services';
import { useInit, useOnInvalid, useOnSubmit } from '../services';
import { ButtonOptions } from './ButtonOptions';
import { ErrorMessageOptions } from './ErrorMessageOptions';
import { Header } from './Header';
import { Instructions } from './Instructions';
import { LoginOptions } from './LoginOptions';
import { Sidebar } from './Sidebar';
import { TelegramOptions } from './TelegramOptions';

const resolver = zodResolver(validationSchema);

const App: React.FC = () => {
	useInit();

	const { savedSettings: defaultValues } = useData();

	const form = useForm({ defaultValues, resolver, mode: 'onBlur' });

	const onSubmit = useOnSubmit(form);

	const onInvalid = useOnInvalid();

	return (
		<Form
			id={`${ROOT_ID}-form`}
			onSubmit={form.handleSubmit(onSubmit, onInvalid)}
			form={form}
		>
			<div className="flex flex-col gap-4 p-4 lg-wp:ps-0 md:flex-row">
				<div className="md:basis-2/3 xl:basis-3/4 shrink-0">
					<Header />
					<Instructions />
					<TelegramOptions />
					<LoginOptions />
					<ButtonOptions />
					<ErrorMessageOptions />
					<SubmitBar form={`${ROOT_ID}-form`} />
				</div>
				<div className="md:basis-2/3 xl:basis-1/4">
					<Sidebar />
				</div>
			</div>
		</Form>
	);
};

export default App;
