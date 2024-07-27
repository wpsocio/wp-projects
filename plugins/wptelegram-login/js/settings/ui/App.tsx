import { Cols75x25 } from '@wpsocio/components';
import { Form, useForm, yupResolver } from '@wpsocio/form';
import { SubmitBar } from '@wpsocio/form-components';
import { ROOT_ID } from '../constants';
import { type DataShape, useData, validationSchema } from '../services';
import { useInit, useOnInvalid, useOnSubmit } from '../services';
import { ButtonOptions } from './ButtonOptions';
import { ErrorMessageOptions } from './ErrorMessageOptions';
import { Header } from './Header';
import { Instructions } from './Instructions';
import { LoginOptions } from './LoginOptions';
import { Sidebar } from './Sidebar';
import { TelegramOptions } from './TelegramOptions';

const resolver = yupResolver(validationSchema);

const App: React.FC = () => {
	useInit();

	const { savedSettings: defaultValues } = useData();

	const form = useForm<DataShape>({ defaultValues, resolver, mode: 'onBlur' });

	const onSubmit = useOnSubmit(form);

	const onInvalid = useOnInvalid();

	const leftCol = (
		<>
			<Header />
			<Instructions />
			<TelegramOptions />
			<LoginOptions />
			<ButtonOptions />
			<ErrorMessageOptions />
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
