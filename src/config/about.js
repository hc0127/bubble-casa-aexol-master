import IconI from "../components/icons/IconI.vue";
import IconPeople from '../components/icons/IconPeople.vue';
import IconPen from '../components/icons/IconPen.vue';
import IconQuestionMark from '../components/icons/IconQuestionMark.vue';
import IconMonitor from "../components/icons/IconMonitor.vue";

export const interface_subsections = [
    {
        icon: IconI,
        title: "About:",
        text: "Library.one is a community-based content aggregator, sharing platform and search engine for professionals. We gather links to the best articles from professional websites, corporate and personal websites, twitter, forums, blogs, YouTube and many other sources. All to provide you with the most comprehensive overview of each topic possible.",
        child: [
            {
                icon: IconQuestionMark,
                title: "What for:",
                text: "Our goal is to provide the most comprehensive, multilingual repository of the most valuable and interesting articles, videos and podcasts in science, computer science, business, humanities and culture."
            },
            {
                icon: IconPeople,
                title: "For who:",
                text: "You are a professional journalist, a specialist, a scientist, an expert, or maybe a corporation or an editorial office? Feel free to index your content to facilitate users' daily browsing and expand your reach."
            },
            {
                icon: IconMonitor,
                title: "Interface:",
                text: "Our powerful user interface, with advanced timeline, contextual search, categorization, and translation features allows users to discover and explore content in a user-friendly way, while promoting top-rated articles.",
                grandchild: [
                    {
                        title: "Node hierarchy",
                        text: "<p>The node hierarchy supports the narrowing of search results within categories. Each parent node is the sum of all child nodes.</p><p>If you would like to have a custom node based on your interests - please email the moderator. We will be adding new topic categories over time, if you have any suggestions - please feel free to contact us.</p>"
                    },
                    {
                        title: "Timeline",
                        text: "With a timeline and ratings, you are in control of what is displayed to you. You can easily browse the archives and sort articles by top user ratings or publishing date."
                    },
                    {
                        title: "Translation",
                        text: "Thanks to the multilingual option and translations, you can easily get to see what people in other countries post."
                    },
                    {
                        title: "Search",
                        text: "Contextual two-step search enables efficient searching. In the first step, you find the most relevant node and then search for specific articles."
                    },
                    {
                        title: "Network of relations",
                        text: "Advanced relationships groups articles into threads for convenient browsing of history."
                    },
                    {
                        title: "Expert view",
                        text: "Expert mode aggregates news, announcements, updates, and research papers into an article list, otherwise, you would have to manually enter an expert node to see the content."
                    }
                ]
            }
        ]
    }
]
export const author_subsections = [
    {
        icon: IconPen,
        title: "Dear Author",
        text: "Please follow a few guidelines:",
        child: [
            {
                text: "You can share links to your own or any other website."
            },
            {
                text: "Check the \"Copyright Ownership\" checkbox only if the content is in fact your own content, otherwise you may be violating copyright laws."
            },
            {
                text: "Find the most appropriate node (subcategory) for your article, as it will be visible not only in this particular node but also in many other places. In many cases, there are multiple paths to finding your article."
            },
            {
                text: "If you have any suggestions or would like a dedicated category for your content - please contact a moderator."
            },
            {
                text: "If you have updated your article, don't republish it, just refresh it in the dashboard. It will be then republished with the new date while keeping the current rating. "
            },
            {
                text: "Your native language articles will be visible to users who choose to view them in your language. Articles written with our editor will be automatically translated into all available languages using translator and displayed in each language by default."
            },
            {
                text: "Please post only the best of your articles, categories are moderated and poor  content will be removed."
            },
        ]
    }
]
