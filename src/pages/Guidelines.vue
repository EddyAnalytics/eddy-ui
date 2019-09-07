<template>
    <div class="guidelines">
        <div class="row">
            <div class="col-12">
                <h1>Guidelines</h1>
            </div>
        </div>
        <div class="block">
            <h2>CSS naming convention</h2>
            <p>
                For our CSS naming convention we basically make use of
                <i>BEM</i>
                . I could rewrite the entire documentation, but you can just as easily find a lot of
                information about it on this website:
                <a href="http://getbem.com/" target="_blank">BEM naming convention</a>
                . For a quick overview of the syntax, check out this link:
                <a
                    href="https://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/"
                    target="_blank"
                >
                    CSS Wizardry's BEM approach
                </a>
                .
            </p>

            <h4>In short</h4>
            <ul>
                <li>
                    Components (
                    <code>.component { }</code>
                    ) are isolated/stand alone pieces of the design, for example sidebars, headers,
                    thumbnails, cards, etc. It's possible for components to be placed in other
                    components.
                </li>
                <li>
                    An element (
                    <code>.component__element { }</code>
                    ) is part of a component that cannot exist on its own. It's not always necessary
                    to add a class to an element (for example a span in a button), but for
                    readability reasons it does help a lot. When an element also occurs in other
                    components you might want to consider if it wouldn't be more appropriate to make
                    it a component.
                </li>
                <li>
                    A modifier (
                    <code>.component--modifier { }</code>
                    ) is a different state of a component, for example with a different background
                    color, more or less padding, mirrored, etc. Usually the modifier will inherit a
                    lot of the styling of the component (you can do so with scss's
                    <i>@extend</i>
                    , after which you can add the modifier specific styling). Sometimes you have a
                    component you would consider to be a modifier (for example
                    <i>.button--delete</i>
                    consisting of only an icon with a hover color), but it's actually easier to not
                    inherit. That's fine too, just decide for yourself if it makes sense.
                </li>
            </ul>

            <h4>Component, Element, Modifier</h4>

            <p>
                BEM stands for "Block, Element, Modifier". We did start out with the (almost)
                complete implementation of BEM, but it has since (2013) changed a little bit,
                adopting to our own preferences:
            </p>

            <ul class="guidelines__list--bullets">
                <li>
                    Since we consider
                    <i>component</i>
                    to be a better suitable name for blocks, we could (or should?) call our version
                    <strong>CEM</strong>
                    (Component, Element, Modifier)
                </li>
                <li>
                    Instead of using a dash for component names consisting of more than 1 word, we
                    use an underscore, e.g.:
                    <ul class="guidelines__list--bullets">
                        <li>cookie_bar</li>
                        <li>cookie_bar--text_link</li>
                        <li>link_block</li>
                        <li>link_block__cta_button</li>
                    </ul>
                </li>
                <li>
                    Contrary to what BEM says about not having to use BEM for everything (for
                    example for a logo inside a header), we do consider everything to be a
                    component. How you choose to define this is up to the design/project and your
                    own choices. In the case of a header with a logo you could:

                    <ol class="guidelines__list--numbers">
                        <li>
                            Split them up in 2 components:

                            <pre>
                                .header
                                {
                                    margin: 0 0 $indent-3;
                                    padding: $indent-2;
                                    background: $color-theme;
                                    color: $color-default;

                                    //positioning of a component inside another component belongs in the parent component =>
                                    .logo
                                    {
                                        float: left;
                                        margin: $indent-1 $indent-3 0 0;
                                    }
                                }

                                .logo
                                {
                                    max-width: 100%;
                                    border: 1px solid $color-border;
                                }
                            </pre>

                            Logo would probably be a very small component, but even if it needs just
                            1 line of styling, it's still a component. The advantage of this
                            approach is that you can easily use the logo component somewhere else if
                            needed. If this is not needed, it's fine to define the logo as an
                            element of the header:
                        </li>
                        <li>
                            Make logo an
                            <i>element</i>
                            of header:
                            <pre>
                            .header
                            {
                                margin: 0 0 $indent-3;
                                padding: $indent-2;
                                background: $color-theme;
                                color: $color-default;

                                .header__logo
                                {
                                    float: left;
                                    max-width: 100%;
                                    margin: $indent-1 $indent-3 0 0;
                                    border: 1px solid $color-border;
                                }
                            }
                        </pre
                            >
                        </li>
                    </ol>
                </li>
                <li>
                    In case you need a class to set a state on a component or element you can do so
                    in the
                    <i>states.scss</i>
                    file by adding
                    <i>has-</i>
                    or
                    <i>is-</i>
                    before whatever state you want to define. For example, if you need a class to
                    set uppercase you can add it to the states.scss file.
                    <pre>
                        .is-uppercase
                        {
                            text-transform: uppercase;
                        }

                        .has-text-right
                        {
                            text-align: right;
                        }
                    </pre>
                </li>
                <li>
                    Except for some cases where you need to override styling it is not necessary to
                    nest elements within the component. However, doing this does help a lot with
                    readability and findability, so we chose to do it anyway. It's usually not
                    necessary to nest more than 3 levels deep though.
                </li>
            </ul>
        </div>

        <div class="block">
            <h2>General CSS rules</h2>
            <ul>
                <li>
                    If the design calls for it (and it usually does) it's possible to use a grid for
                    the layout. We made a custom made version of the Boostrap 4 flexbox grid to
                    accomodate our needs. If necessary this can be changed by changing the settings
                    in the file (grid.scss in the general folder)
                </li>
                <li>
                    Components need to be build in a way that you can easily drop them in another
                    (grid) container and they would still look okay (-ish, in case of very small or
                    large containers)
                </li>
                <li>
                    Fixed component heights (ideally based on content) and widths (ideally based on
                    grid) should be avoided if possible. Sometimes the design does call for it, in
                    these cases carefully decide what the best approach would be.
                </li>
                <li>
                    Use
                    <i>rem</i>
                    for font-sizes. 1.6rem = 16px (make sure font-size = 62.5% on the html tag)
                </li>
                <li>
                    Positioning of child components inside parent components should be handled in
                    the parent component (see header / logo example above)
                </li>
                <li>
                    Divs, sections, articles, main etc. get a standard
                    <code>position: relative;</code>
                    .
                </li>
                <li>
                    Absolute positioning is only a good solution if you want to place elements in
                    the padding, pull them out of the standard flow, etc.
                </li>
                <li>
                    Only use margins for spacing between components or elements (outside the
                    (imaginary) border). Padding is used for adding spacing inside the
                    component/element (inside the (imaginary) border).
                </li>
                <li>
                    Clearfix is usually not necessary, certainly not as an empty div. You can use a
                    clearfix mixin if necessary, but it's just as effective to add 'overflow:
                    hidden' to the container. Obviously, if there are elements that do need to be
                    visible outside the container, clearfix is still the better choice.
                </li>
                <li>We do not use ID's for styling! Use classes instead.</li>
                <li>
                    Indents in the code have 4 spaces, the opening curly brace goes on the next line
                </li>
                <li>
                    It's almost never necessary to specify what kind of element you're working with
                    (
                    <code>div.header</code>
                    ),
                    <code>.header</code>
                    will usually do.
                </li>
                <li>
                    Do not use tables for layout! If really necessary you can define
                    <code>display: table;</code>
                    and
                    <code>display: table-cell;</code>
                    , but if it can be avoided (for example by using flexbox), then that's always
                    better.
                </li>
                <li>
                    You don't need to comment out styling that's no longer used. You can just remove
                    it.
                </li>
                <li>
                    If you choose to do something that doesn't follow these rules, please add a
                    comment with the reasons
                </li>
                <li>
                    Please add the styling for the component directly below the tag, further
                    elements/components below that:
                    <pre>
                        .component
                        {
                            display: block;
                            margin: $indent-2 0;
                            padding: $indent-2;
                            border: 1px solid $color-border;

                            .component__element
                            {
                                //Styling here
                            }

                            .other_component
                            {
                                float: right;
                                margin: $indent-2 0 0;
                            }
                        }
                    </pre>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class PageNotFound extends Vue {
    name = 'page-not-found';
}
</script>
