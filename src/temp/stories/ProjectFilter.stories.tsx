import Filter from '../Project/Filter';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Filter> = {
  component: Filter,
};

export default meta;
type Story = StoryObj<typeof Filter>;

export const FilterInActive: Story = {
  args: {
    activeFilter: false,
    projectList: [],
  },
};

export const FilterActive = {
  args: {
    activeFilter: true,
    projectList: [
      'Natural Regeneration',
      'Mangroves',
      'Managed Regeneration',
      'Other Restoration',
      'Tree Planting',
      'Agroforestry',
      'Urban Restoration',
      'Conservation',
    ],
  },
};
