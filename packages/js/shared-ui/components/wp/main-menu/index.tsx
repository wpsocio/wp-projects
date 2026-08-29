import { MenuGroup, MenuItem } from '@wordpress/components';
import { __ } from '@wpsocio/i18n';
import { chevronRight } from '@wpsocio/ui/icons/wp';
import styles from './styles.module.scss';

export type MenuItemProps = React.ComponentProps<typeof MenuItem>;

export type MainMenuProps = {
	items: MenuItemProps[];
};

export function MainMenu({ items }: MainMenuProps) {
	return (
		<MenuGroup className={styles.container}>
			{items.map((item, index) => (
				<MenuItem
					key={item.id || index}
					info={__('Manage your bot tokens.')}
					icon={item.icon || chevronRight}
					iconPosition="right"
					{...item}
				>
					{item.children || item.label || item.title}
				</MenuItem>
			))}
		</MenuGroup>
	);
}
