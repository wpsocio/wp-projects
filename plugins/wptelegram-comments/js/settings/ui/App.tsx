import { Form, useForm, zodResolver } from '@wpsocio/form';
import { SubmitBar } from '@wpsocio/shared-ui/form/submit/submit-bar.js';
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

const resolver = zodResolver(validationSchema);

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
					<Configuration />
					<SubmitBar form={`${ROOT_ID}-form`} />
				</div>
				<div className="md:basis-1/3 xl:basis-1/4">
					<Sidebar />
				</div>
			</div>
		</Form>
	);
};

export default App;
