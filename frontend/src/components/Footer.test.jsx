import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';

describe('Footer Component', () => {
  it('renders footer without crashing', () => {
    const { container } = render(<Footer />);
    expect(container).toBeTruthy();
  });
});
