import { Form, useForm, zodResolver } from '@wpsocio/form';
import { SubmitBar } from '@wpsocio/shared-ui/form/submit/submit-bar.js';
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
					<TabbedSections />
					<SubmitBar form={`${ROOT_ID}-form`} showSeparator={false} />
				</div>
				<div className="md:basis-1/3 xl:basis-1/4">
					<Sidebar />
				</div>
			</div>
		</Form>
	);
};

export default App;
