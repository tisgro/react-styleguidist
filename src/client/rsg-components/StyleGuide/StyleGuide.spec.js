import React from 'react';
import TableOfContents from '../TableOfContents';
import StyleGuide from './StyleGuide';
import { StyleGuideRenderer } from './StyleGuideRenderer';
import { DisplayModes } from '../../consts';

const sections = [
	{
		components: [
			{
				name: 'Foo',
				pathLine: 'components/foo.js',
				filepath: 'components/foo.js',
				props: {
					description: 'Foo foo',
				},
			},
			{
				name: 'Bar',
				pathLine: 'components/bar.js',
				filepath: 'components/bar.js',
				props: {
					description: 'Bar bar',
				},
			},
		],
	},
];
const config = {
	title: 'Hello',
	version: '1.0.0',
	showSidebar: true,
};

it('should render components list', () => {
	const actual = shallow(
		<StyleGuide
			codeRevision={1}
			config={config}
			pagePerSection={false}
			sections={sections}
			allSections={sections}
			slots={{}}
		/>
	);

	expect(actual).toMatchSnapshot();
});

it('should render welcome screen', () => {
	const actual = shallow(
		<StyleGuide
			codeRevision={1}
			config={config}
			sections={[]}
			allSections={[]}
			slots={{}}
			welcomeScreen
		/>
	);

	expect(actual).toMatchSnapshot();
});

it('should render an error when componentDidCatch() is triggered', () => {
	const wrapper = shallow(
		<StyleGuide codeRevision={1} config={config} sections={[]} allSections={[]} slots={{}} />
	);
	wrapper
		.instance()
		.componentDidCatch({ toString: () => 'error' }, { componentStack: { toString: () => 'info' } });
	wrapper.update();
	expect(wrapper).toMatchSnapshot();
});

describe('sidebar rendering', () => {
	it('renderer should have sidebar if showSidebar is not set', () => {
		const wrapper = shallow(
			<StyleGuide
				codeRevision={1}
				config={config}
				sections={sections}
				allSections={sections}
				slots={{}}
			/>
		);

		expect(wrapper.prop('hasSidebar')).toEqual(true);
	});

	it('renderer should not have sidebar if showSidebar is false', () => {
		const wrapper = shallow(
			<StyleGuide
				codeRevision={1}
				config={{
					...config,
					showSidebar: false,
				}}
				sections={sections}
				allSections={sections}
				slots={{}}
			/>
		);

		expect(wrapper.prop('hasSidebar')).toEqual(false);
	});

	it('renderer should not have sidebar in isolation mode', () => {
		const wrapper = shallow(
			<StyleGuide
				codeRevision={1}
				config={config}
				sections={sections}
				allSections={sections}
				slots={{}}
				displayMode={DisplayModes.component}
			/>
		);

		expect(wrapper.prop('hasSidebar')).toEqual(false);
	});

	it('renderer should have sidebar if pagePerSection is true', () => {
		const wrapper = shallow(
			<StyleGuide
				codeRevision={1}
				config={config}
				sections={sections}
				allSections={sections}
				slots={{}}
				displayMode={DisplayModes.all}
				pagePerSection
			/>
		);

		expect(wrapper.prop('hasSidebar')).toEqual(true);
	});
});

it('renderer should render logo, version, table of contents, ribbon and passed children', () => {
	const actual = shallow(
		<StyleGuideRenderer
			classes={{}}
			title={config.title}
			version={config.version}
			toc={<TableOfContents sections={sections} />}
			homepageUrl="http://react-styleguidist.js.org/"
			hasSidebar
			onThemeChange={() => null}
		>
			<h1>Content</h1>
		</StyleGuideRenderer>
	);

	expect(actual).toMatchSnapshot();
});

describe('when multiple themes are configured', () => {
	const themes = [
		{
			id: 'dark',
			styles: {
				color: {
					base: '#ccc',
				},
			},
		},
		{
			id: 'light',
			styles: {
				color: {
					base: '#333',
				},
			},
		},
	];

	it('current theme should be initialized to default theme if configured', () => {
		const config = {
			defaultTheme: 'light',
			themes,
		};

		const wrapper = shallow(
			<StyleGuide
				codeRevision={1}
				config={config}
				pagePerSection={false}
				sections={sections}
				allSections={sections}
				slots={{}}
			/>
		);

		expect(wrapper.state('currentTheme')).toEqual('light');
	});

	it('current theme should be initialized to first theme if default not configured', () => {
		const config = {
			themes,
		};

		const wrapper = shallow(
			<StyleGuide
				codeRevision={1}
				config={config}
				pagePerSection={false}
				sections={sections}
				allSections={sections}
				slots={{}}
			/>
		);

		expect(wrapper.state('currentTheme')).toEqual('dark');
	});
});
