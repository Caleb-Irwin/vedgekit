import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const opTheme: CustomThemeConfig = {
	name: 'op-theme',
	properties: {
		// =~= Theme Properties =~=
		'--theme-font-family-base': `system-ui`,
		'--theme-font-family-heading': `system-ui`,
		'--theme-font-color-base': '0 0 0',
		'--theme-font-color-dark': '255 255 255',
		'--theme-rounded-base': '9999px',
		'--theme-rounded-container': '4px',
		'--theme-border-base': '1px',
		// =~= Theme On-X Colors =~=
		'--on-primary': '255 255 255',
		'--on-secondary': '255 255 255',
		'--on-tertiary': '0 0 0',
		'--on-success': '0 0 0',
		'--on-warning': '0 0 0',
		'--on-error': '0 0 0',
		'--on-surface': '255 255 255',
		// =~= Theme Colors =~=
		// primary | #43976A
		'--color-primary-50': '227 239 233', // #e3efe9
		'--color-primary-100': '217 234 225', // #d9eae1
		'--color-primary-200': '208 229 218', // #d0e5da
		'--color-primary-300': '180 213 195', // #b4d5c3
		'--color-primary-400': '123 182 151', // #7bb697
		'--color-primary-500': '67 151 106', // #43976A
		'--color-primary-600': '60 136 95', // #3c885f
		'--color-primary-700': '50 113 80', // #327150
		'--color-primary-800': '40 91 64', // #285b40
		'--color-primary-900': '33 74 52', // #214a34
		// secondary | #2e6849
		'--color-secondary-50': '224 232 228', // #e0e8e4
		'--color-secondary-100': '213 225 219', // #d5e1db
		'--color-secondary-200': '203 217 210', // #cbd9d2
		'--color-secondary-300': '171 195 182', // #abc3b6
		'--color-secondary-400': '109 149 128', // #6d9580
		'--color-secondary-500': '46 104 73', // #2e6849
		'--color-secondary-600': '41 94 66', // #295e42
		'--color-secondary-700': '35 78 55', // #234e37
		'--color-secondary-800': '28 62 44', // #1c3e2c
		'--color-secondary-900': '23 51 36', // #173324
		// tertiary | #adadad
		'--color-tertiary-50': '243 243 243', // #f3f3f3
		'--color-tertiary-100': '239 239 239', // #efefef
		'--color-tertiary-200': '235 235 235', // #ebebeb
		'--color-tertiary-300': '222 222 222', // #dedede
		'--color-tertiary-400': '198 198 198', // #c6c6c6
		'--color-tertiary-500': '173 173 173', // #adadad
		'--color-tertiary-600': '156 156 156', // #9c9c9c
		'--color-tertiary-700': '130 130 130', // #828282
		'--color-tertiary-800': '104 104 104', // #686868
		'--color-tertiary-900': '85 85 85', // #555555
		// success | #96d35f
		'--color-success-50': '239 248 231', // #eff8e7
		'--color-success-100': '234 246 223', // #eaf6df
		'--color-success-200': '229 244 215', // #e5f4d7
		'--color-success-300': '213 237 191', // #d5edbf
		'--color-success-400': '182 224 143', // #b6e08f
		'--color-success-500': '150 211 95', // #96d35f
		'--color-success-600': '135 190 86', // #87be56
		'--color-success-700': '113 158 71', // #719e47
		'--color-success-800': '90 127 57', // #5a7f39
		'--color-success-900': '74 103 47', // #4a672f
		// warning | #fff76b
		'--color-warning-50': '255 254 233', // #fffee9
		'--color-warning-100': '255 253 225', // #fffde1
		'--color-warning-200': '255 253 218', // #fffdda
		'--color-warning-300': '255 252 196', // #fffcc4
		'--color-warning-400': '255 249 151', // #fff997
		'--color-warning-500': '255 247 107', // #fff76b
		'--color-warning-600': '230 222 96', // #e6de60
		'--color-warning-700': '191 185 80', // #bfb950
		'--color-warning-800': '153 148 64', // #999440
		'--color-warning-900': '125 121 52', // #7d7934
		// error | #ff6250
		'--color-error-50': '255 231 229', // #ffe7e5
		'--color-error-100': '255 224 220', // #ffe0dc
		'--color-error-200': '255 216 211', // #ffd8d3
		'--color-error-300': '255 192 185', // #ffc0b9
		'--color-error-400': '255 145 133', // #ff9185
		'--color-error-500': '255 98 80', // #ff6250
		'--color-error-600': '230 88 72', // #e65848
		'--color-error-700': '191 74 60', // #bf4a3c
		'--color-error-800': '153 59 48', // #993b30
		'--color-error-900': '125 48 39', // #7d3027
		// surface | #707070
		'--color-surface-50': '234 234 234', // #eaeaea
		'--color-surface-100': '226 226 226', // #e2e2e2
		'--color-surface-200': '219 219 219', // #dbdbdb
		'--color-surface-300': '198 198 198', // #c6c6c6
		'--color-surface-400': '155 155 155', // #9b9b9b
		'--color-surface-500': '112 112 112', // #707070
		'--color-surface-600': '101 101 101', // #656565
		'--color-surface-700': '84 84 84', // #545454
		'--color-surface-800': '67 67 67', // #434343
		'--color-surface-900': '55 55 55' // #373737
	}
};
