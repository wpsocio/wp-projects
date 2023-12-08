import { Button as WPButton } from '@wordpress/components';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props)=> {
    return <WPButton {...props} variant='link'/>
}