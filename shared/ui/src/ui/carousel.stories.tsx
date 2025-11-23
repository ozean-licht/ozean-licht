import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from './carousel';
import { CossUIButton as Button } from '../cossui';
import { CossUICard as Card } from '../cossui';

/**
 * Carousel (Slider) primitive component built on Embla Carousel.
 *
 * **This is a Tier 1 Primitive** - Embla Carousel-based component with minimal styling.
 * No Tier 2 branded version exists - this is the definitive carousel implementation.
 *
 * ## Embla Carousel Features
 * - **Touch & Drag**: Native touch support with smooth dragging on all devices
 * - **Keyboard Navigation**: Arrow keys for navigation (left/right or up/down)
 * - **Responsive**: Automatically adapts to container size
 * - **Flexible**: Supports horizontal and vertical orientations
 * - **Performant**: Hardware-accelerated animations, no layout thrashing
 * - **Accessible**: ARIA attributes for screen readers
 * - **Customizable**: Loop, autoplay, alignment, multiple items per view
 *
 * ## Component Structure
 * ```tsx
 * <Carousel opts={{ loop: true, align: 'start' }} orientation="horizontal">
 *   <CarouselContent> // Container for all slides
 *     <CarouselItem> // Individual slide (can have custom basis like "basis-1/2")
 *       {content}
 *     </CarouselItem>
 *     <CarouselItem>{content}</CarouselItem>
 *   </CarouselContent>
 *   <CarouselPrevious /> // Previous button
 *   <CarouselNext />     // Next button
 * </Carousel>
 * ```
 *
 * ## Carousel Options (via opts prop)
 * - **loop**: Enable infinite looping (default: false)
 * - **align**: Slide alignment - 'start' | 'center' | 'end' (default: 'start')
 * - **slidesToScroll**: Number of slides to scroll at once (default: 1)
 * - **skipSnaps**: Skip snaps that are not aligned (default: false)
 * - **dragFree**: Free dragging without snap points (default: false)
 * - **containScroll**: Contain slides to carousel viewport (default: '')
 *
 * ## Orientation
 * - **horizontal**: Left-to-right scrolling (default)
 * - **vertical**: Top-to-bottom scrolling
 *
 * ## Common Use Cases
 * - Image galleries and product showcases
 * - Testimonial rotators
 * - Feature highlights
 * - Content sliders with multiple items per view
 * - Hero banners with autoplay
 * - Card carousels with responsive breakpoints
 *
 * ## Responsive Layouts
 * Use Tailwind basis utilities on CarouselItem:
 * - `basis-full` - 1 item per view
 * - `basis-1/2` - 2 items per view
 * - `md:basis-1/3` - 3 items on medium screens
 * - `lg:basis-1/4` - 4 items on large screens
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Carousel',
  component: Carousel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A carousel/slider component built on Embla Carousel with support for touch, keyboard, and mouse interactions. Supports horizontal and vertical orientations, looping, alignment options, and responsive layouts.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default horizontal carousel.
 *
 * Basic carousel with horizontal orientation showing numbered slides.
 */
export const Default: Story = {
  render: () => (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="border-2 border-slate-200">
                <div className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </div>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

/**
 * Vertical orientation carousel.
 *
 * Carousel with vertical scrolling using arrow buttons rotated 90 degrees.
 */
export const VerticalOrientation: Story = {
  render: () => (
    <Carousel orientation="vertical" className="w-full max-w-xs">
      <CarouselContent className="h-[400px]">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="border-2 border-slate-200">
                <div className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </div>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

/**
 * Carousel with loop enabled.
 *
 * Infinite looping allows continuous navigation in both directions.
 */
export const WithLoop: Story = {
  render: () => (
    <Carousel opts={{ loop: true }} className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="border-2 border-slate-200">
                <div className="flex aspect-square items-center justify-center p-6">
                  <span className="text-3xl font-semibold">
                    Slide {index + 1}
                  </span>
                  <span className="absolute bottom-4 text-xs text-muted-foreground">
                    Loop enabled
                  </span>
                </div>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

/**
 * Center-aligned carousel.
 *
 * Slides are centered in the viewport with partial views of adjacent slides.
 */
export const CenterAlign: Story = {
  render: () => (
    <Carousel opts={{ align: 'center', loop: true }} className="w-full max-w-sm">
      <CarouselContent>
        {Array.from({ length: 7 }).map((_, index) => (
          <CarouselItem key={index} className="basis-4/5">
            <div className="p-1">
              <Card className="border-2 border-slate-200">
                <div className="flex aspect-square items-center justify-center p-6">
                  <span className="text-3xl font-semibold">{index + 1}</span>
                </div>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

/**
 * Multiple items per view.
 *
 * Responsive carousel showing 1 item on mobile, 2 on tablets, 3 on desktop.
 */
export const MultipleItemsPerView: Story = {
  render: () => (
    <Carousel className="w-full max-w-4xl">
      <CarouselContent className="-ml-2 md:-ml-4">
        {Array.from({ length: 9 }).map((_, index) => (
          <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card className="border-2 border-slate-200">
                <div className="flex aspect-square items-center justify-center p-6">
                  <span className="text-2xl font-semibold">Item {index + 1}</span>
                </div>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

/**
 * Carousel with custom indicators.
 *
 * Shows current slide position with dots indicator using carousel API.
 */
export const WithIndicators: Story = {
  render: () => {
    const IndicatorCarousel = () => {
      const [api, setApi] = useState<CarouselApi>();
      const [current, setCurrent] = useState(0);
      const [count, setCount] = useState(0);

      useEffect(() => {
        if (!api) {
          return;
        }

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());

        api.on('select', () => {
          setCurrent(api.selectedScrollSnap());
        });
      }, [api]);

      return (
        <div className="space-y-4">
          <Carousel setApi={setApi} className="w-full max-w-xs">
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="border-2 border-slate-200">
                      <div className="flex aspect-square items-center justify-center p-6">
                        <span className="text-4xl font-semibold">{index + 1}</span>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === current
                    ? 'bg-slate-900 w-8'
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="text-center text-sm text-muted-foreground">
            Slide {current + 1} of {count}
          </div>
        </div>
      );
    };

    return <IndicatorCarousel />;
  },
};

/**
 * Auto-play carousel.
 *
 * Automatically advances slides every 3 seconds with loop enabled.
 * Note: For production autoplay with plugins, install embla-carousel-autoplay.
 */
export const AutoPlay: Story = {
  render: () => {
    const AutoPlayCarousel = () => {
      const [api, setApi] = useState<CarouselApi>();

      useEffect(() => {
        if (!api) {
          return;
        }

        const intervalId = setInterval(() => {
          api.scrollNext();
        }, 3000);

        return () => clearInterval(intervalId);
      }, [api]);

      return (
        <div className="space-y-2">
          <Carousel setApi={setApi} opts={{ loop: true }} className="w-full max-w-xs">
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="border-2 border-slate-200">
                      <div className="flex aspect-square items-center justify-center p-6">
                        <div className="text-center">
                          <span className="text-4xl font-semibold">{index + 1}</span>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Auto-advances
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <p className="text-center text-xs text-muted-foreground">
            Auto-play every 3 seconds (manual implementation)
          </p>
        </div>
      );
    };

    return <AutoPlayCarousel />;
  },
};

/**
 * Image gallery carousel.
 *
 * Carousel optimized for displaying images with descriptions.
 */
export const ImageGallery: Story = {
  render: () => {
    const images = [
      { color: '#0ec2bc', title: 'Turquoise Dream', desc: 'Ocean waves at sunset' },
      { color: '#10b981', title: 'Emerald Forest', desc: 'Deep woodland paths' },
      { color: '#8b5cf6', title: 'Violet Sky', desc: 'Northern lights dance' },
      { color: '#f59e0b', title: 'Amber Glow', desc: 'Desert dunes at dawn' },
      { color: '#ec4899', title: 'Rose Garden', desc: 'Blooming in spring' },
    ];

    return (
      <Carousel opts={{ loop: true }} className="w-full max-w-md">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card className="border-2 border-slate-200 overflow-hidden">
                  <div
                    className="flex aspect-video items-center justify-center relative"
                    style={{ backgroundColor: image.color }}
                  >
                    <span className="text-white text-6xl font-bold opacity-30">
                      {index + 1}
                    </span>
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-semibold text-lg">{image.title}</h3>
                    <p className="text-sm text-muted-foreground">{image.desc}</p>
                  </div>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );
  },
};

/**
 * Product showcase carousel.
 *
 * E-commerce style product carousel with multiple items and responsive layout.
 */
export const ProductShowcase: Story = {
  render: () => {
    const products = [
      { name: 'Ocean Breeze', price: '$29.99', rating: 4.5 },
      { name: 'Mountain Peak', price: '$34.99', rating: 5.0 },
      { name: 'Forest Trail', price: '$24.99', rating: 4.0 },
      { name: 'Desert Sun', price: '$39.99', rating: 4.8 },
      { name: 'Arctic Ice', price: '$44.99', rating: 4.7 },
      { name: 'Coral Reef', price: '$27.99', rating: 4.3 },
      { name: 'Valley Mist', price: '$32.99', rating: 4.6 },
    ];

    return (
      <div className="w-full max-w-5xl space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <p className="text-muted-foreground">Discover our latest collection</p>
        </div>

        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map((product, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div className="p-1">
                  <Card className="border-2 border-slate-200 hover:border-slate-300 transition-colors">
                    <div className="p-4 space-y-3">
                      {/* Product image placeholder */}
                      <div
                        className="aspect-square rounded-lg flex items-center justify-center text-white text-2xl font-bold"
                        style={{ backgroundColor: '#0ec2bc' }}
                      >
                        {product.name.substring(0, 2)}
                      </div>

                      {/* Product details */}
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold" style={{ color: '#0ec2bc' }}>
                            {product.price}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm text-muted-foreground">
                              {product.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button className="w-full" variant="outline" size="sm">
                        Add to Cart
                      </Button>
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    );
  },
};

/**
 * Testimonial carousel.
 *
 * Customer testimonials with autoplay and center alignment.
 */
export const TestimonialCarousel: Story = {
  render: () => {
    const testimonials = [
      {
        quote: 'This product completely transformed how we work. Incredible results!',
        author: 'Sarah Johnson',
        role: 'CEO, TechCorp',
        avatar: 'SJ',
      },
      {
        quote: 'Outstanding quality and support. Highly recommended for any team.',
        author: 'Michael Chen',
        role: 'Designer, Creative Studio',
        avatar: 'MC',
      },
      {
        quote: 'Game-changer for our business. Couldn\'t be happier with the results.',
        author: 'Emma Rodriguez',
        role: 'Product Manager, StartupXYZ',
        avatar: 'ER',
      },
      {
        quote: 'Intuitive, powerful, and reliable. Everything we needed and more.',
        author: 'David Kim',
        role: 'CTO, Innovation Labs',
        avatar: 'DK',
      },
    ];

    const TestimonialCarouselComponent = () => {
      const [api, setApi] = useState<CarouselApi>();

      useEffect(() => {
        if (!api) {
          return;
        }

        const intervalId = setInterval(() => {
          api.scrollNext();
        }, 5000);

        return () => clearInterval(intervalId);
      }, [api]);

      return (
        <div className="w-full max-w-3xl space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold">What Our Customers Say</h2>
            <p className="text-muted-foreground">Real feedback from real people</p>
          </div>

          <Carousel
            setApi={setApi}
            opts={{ loop: true, align: 'center' }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <div className="p-4">
                    <Card className="border-2 border-slate-200">
                      <div className="p-8 space-y-6">
                        {/* Quote */}
                        <div className="text-center">
                          <svg
                            className="w-8 h-8 mx-auto mb-4 opacity-20"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                          </svg>
                          <p className="text-lg italic">{testimonial.quote}</p>
                        </div>

                        {/* Author */}
                        <div className="flex items-center justify-center gap-4">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                            style={{ backgroundColor: '#0ec2bc' }}
                          >
                            {testimonial.avatar}
                          </div>
                          <div className="text-left">
                            <p className="font-semibold">{testimonial.author}</p>
                            <p className="text-sm text-muted-foreground">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <p className="text-center text-xs text-muted-foreground">
            Auto-advances every 5 seconds
          </p>
        </div>
      );
    };

    return <TestimonialCarouselComponent />;
  },
};

/**
 * Ozean Licht themed carousel.
 *
 * Carousel with Ozean Licht turquoise (#0ec2bc) accent colors and branding.
 */
export const OzeanLichtThemed: Story = {
  render: () => {
    const features = [
      {
        icon: '🌊',
        title: 'Ocean-Inspired',
        description: 'Design flows like water',
      },
      {
        icon: '✨',
        title: 'Cosmic Effects',
        description: 'Stars guide your journey',
      },
      {
        icon: '🎨',
        title: 'Elegant Design',
        description: 'Beauty meets function',
      },
      {
        icon: '⚡',
        title: 'Lightning Fast',
        description: 'Performance optimized',
      },
      {
        icon: '🔒',
        title: 'Secure by Default',
        description: 'Your data is safe',
      },
    ];

    return (
      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold" style={{ color: '#0ec2bc' }}>
            Ozean Licht Features
          </h2>
          <p className="text-muted-foreground mt-2">
            Discover the magic of our platform
          </p>
        </div>

        <Carousel opts={{ loop: true }} className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {features.map((feature, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card
                    className="border-2 transition-all hover:shadow-lg"
                    style={{ borderColor: '#0ec2bc' }}
                  >
                    <div className="p-6 space-y-4 text-center">
                      <div className="text-5xl">{feature.icon}</div>
                      <h3 className="text-xl font-semibold" style={{ color: '#0ec2bc' }}>
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            className="border-2"
            style={{ borderColor: '#0ec2bc', color: '#0ec2bc' }}
          />
          <CarouselNext
            className="border-2"
            style={{ borderColor: '#0ec2bc', color: '#0ec2bc' }}
          />
        </Carousel>

        <div className="flex justify-center gap-2 text-sm text-muted-foreground">
          <span>Swipe</span>
          <span>•</span>
          <span>Drag</span>
          <span>•</span>
          <span>Arrow Keys</span>
        </div>
      </div>
    );
  },
};

/**
 * Controlled carousel API.
 *
 * Demonstrates programmatic control using the Carousel API with custom controls.
 */
export const ControlledCarouselAPI: Story = {
  render: () => {
    const ControlledCarouselComponent = () => {
      const [api, setApi] = useState<CarouselApi>();
      const [current, setCurrent] = useState(0);
      const [count, setCount] = useState(0);
      const [canScrollPrev, setCanScrollPrev] = useState(false);
      const [canScrollNext, setCanScrollNext] = useState(false);

      useEffect(() => {
        if (!api) {
          return;
        }

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());
        setCanScrollPrev(api.canScrollPrev());
        setCanScrollNext(api.canScrollNext());

        api.on('select', () => {
          setCurrent(api.selectedScrollSnap());
          setCanScrollPrev(api.canScrollPrev());
          setCanScrollNext(api.canScrollNext());
        });
      }, [api]);

      return (
        <div className="w-full max-w-md space-y-4">
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
              {Array.from({ length: 7 }).map((_, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="border-2 border-slate-200">
                      <div className="flex aspect-square items-center justify-center p-6">
                        <span className="text-4xl font-semibold">{index + 1}</span>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Custom controls */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => api?.scrollPrev()}
                disabled={!canScrollPrev}
              >
                Previous
              </Button>

              <span className="text-sm font-medium">
                {current + 1} / {count}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => api?.scrollNext()}
                disabled={!canScrollNext}
              >
                Next
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => api?.scrollTo(0)}
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => api?.scrollTo(count - 1)}
              >
                Last
              </Button>
            </div>

            <div className="flex gap-1">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  className={`flex-1 h-1 rounded transition-colors ${
                    index === current ? 'bg-slate-900' : 'bg-slate-300'
                  }`}
                  onClick={() => api?.scrollTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      );
    };

    return <ControlledCarouselComponent />;
  },
};

/**
 * Drag-free carousel.
 *
 * Free-scrolling carousel without snap points for fluid dragging.
 */
export const DragFree: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-2">
      <Carousel opts={{ dragFree: true, containScroll: 'trimSnaps' }} className="w-full">
        <CarouselContent className="-ml-2">
          {Array.from({ length: 15 }).map((_, index) => (
            <CarouselItem key={index} className="pl-2 basis-1/4">
              <div className="p-1">
                <Card className="border-2 border-slate-200">
                  <div className="flex aspect-square items-center justify-center p-4">
                    <span className="text-xl font-semibold">{index + 1}</span>
                  </div>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <p className="text-center text-xs text-muted-foreground">
        Drag freely without snap points
      </p>
    </div>
  ),
};
