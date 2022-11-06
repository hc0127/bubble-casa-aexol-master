import { reactive, ref, watch } from 'vue';
import { callApi } from '../../api/callApi.js';
import _ from 'lodash';
import dayjs from 'dayjs';
import { requestFailError, serverError } from '../../helper/notifications';


export const article_list = ref({
  data: [],
  filtered: 0,
});

const relevancyArticleList = ref([])

export const init_loading = ref(true);
export const is_loading = ref(false);
export const offset = ref(0)
export const limit = 10;

export const filter = reactive({
  rating: 0,
  created_at: 0,
  node_id: null,
  language: localStorage.getItem('setLang') || 'en',
  is_video: undefined,
  title: ''
});

export const searchIoMode = ref(false)

export const searchIo = async (query) => {
  return await callApi('search', 'query', query)
}

const createdAt = {
  field: 'created_at',
  order: 'DESC'
}

const createdDate = {
  field: 'create_date',
  order: 'DESC'
}

const rating = {
  field: 'rating',
  order: 'DESC'
}

export let order_by = reactive([createdAt])

export const is_favourite = ref(false)
export const is_received = ref(false)

var relevancyArray = []

export const sortArticleList = (sortBy) => {
  if(sortBy === 'date') {
    relevancyArray = article_list.value.data.slice()
    relevancyArticleList.value = article_list.value.data
    article_list.value.data = article_list.value.data.sort(function(a,b){
      var c = new Date(a.create_date);
      var d = new Date(b.create_date);
      return d-c;
      });
  }
  if(sortBy === 'relevancy') {
    article_list.value.data = relevancyArray.slice()
  }

}

const fetchArticles = async (service, action) => {
  try {
    const res = await callApi(service,
      action,
      {
        limit,
        offset: offset.value,
        where: prepareFilter(),
        show_child_article: 1,
        order_by
      });
      searchIoMode.value = false
    if (!res.success) {
      requestFailError(res.error)
    }
    return res;
  }
  catch (e) {
    serverError(e);
  }
}

const mapOrder = function (array, order, key) {
  
  array.sort( function (a, b) {
    var A = a[key], B = b[key];
    
    if (order.indexOf(A) > order.indexOf(B)) {
      return 1;
    } else {
      return -1;
    }
    
  });
  
  return array;
};


export const fetchSearchArticles = async (service, action, articles) => {
  try {
    const res = await callApi(service,
      action,
      {
        limit,
        where: articles.length > 0 ? {id: articles} : {},
      });
    if (!res.success) {
      requestFailError(res.error)
    }
    if(searchIoMode.value) {
      const articlesOfNum = articles.map(str => {
        return Number(str);
      });
      const sortedData = mapOrder(res.data, articlesOfNum, 'id')
      article_list.value.data = [...article_list.value.data, ...sortedData];
      return
    } else {
      const articlesOfNum = articles.map(str => {
        return Number(str);
      });
      const sortedData = mapOrder(res.data, articlesOfNum, 'id')
      article_list.value.data = sortedData
      searchIoMode.value = true
    }
  }
  catch (e) {
    serverError(e);
  }
}

export const scroll_wrapper = ref(null);

export const scrollTop = () => {
  if (scroll_wrapper.value) {
    scroll_wrapper.value.scrollTop = 0
  }
}

export const setOffset = () => {
  offset.value += limit;
}

export const clearOffset = () => {
  offset.value = 0
}

export const getArticleList = async () => {
  is_loading.value = true;

  const getRes = () => {
    if (is_favourite.value) return fetchArticles('favourite-article', 'list')
    if (is_received.value) return fetchArticles('favourite-article', 'sentToMe')
    return fetchArticles('article', 'getAll')
  }
  const res = await getRes()

  if (!res) return;
  if (offset.value) {
    article_list.value.data = [...article_list.value.data, ...res.data];
  } else {
    article_list.value.data = res.data;
    article_list.value.filtered = res.filtered;
  }
  if (!offset.value) {
    setOffset();
  }
  init_loading.value = false; //content loader lunched on mounted
  is_loading.value = false;
};

export const setFilter = (key, value) => {
  filter[key] = value;
  clearOffset()
};

export const setOrderBy = (timeline, is_rating) => {

  order_by.splice(0, order_by.length)
  if ((is_rating.value && timeline.value) || (!timeline.value && !is_rating.value)) {
    order_by.push(createdDate, rating)
    return;
  }

  if (timeline.value) {
    return order_by.splice(0, 0, createdAt)
  }
  if (is_rating.value && !timeline.value) {
    return order_by.push(rating)
  }
}

export const clearAllFilter = () => {
  filter.rating = 0;
  filter.created_at = 0;
  filter.is_video = undefined;
  filter.title = '';
  filter.language = localStorage.getItem('setLang') || 'en'
  filter.node_id = null;
  clearOffset()
};

export const clearOneFilter = (key, default_value = 0) => {
  filter[key] = default_value
  clearOffset()
};

const debounceGetAll = _.debounce(getArticleList, 500);

watch(
  () => order_by,
  async () => {
    debounceGetAll()
  },
  { deep: true }
)

watch(
  () => filter,
  async (current, prev) => {

    if (current.node_id === null) return;
    debounceGetAll()
  },
  { deep: true }
);

const prepareFilter = () => {
  const prepare_filter = { ...filter };
  if (prepare_filter.created_at) {
    prepare_filter.created_at = timeline_range_enum[prepare_filter.created_at || 0].date;
  } else {
    prepare_filter.created_at = undefined
  }

  if (prepare_filter.title?.trim().length) {
    prepare_filter.title = prepare_filter.title.trim()
      .split(' ')
      .map(word => `${word}:*`)
      .join(' & ');
  } else {
    prepare_filter.title = undefined;
  }
  return prepare_filter;
};

export const timeline_range_enum = {
  0: {
    label: 'now',
    date: dayjs()
  },
  1: {
    label: 'week',
    date: dayjs()
      .subtract(1, 'week')
  },
  2: {
    label: '2 weeks',
    date: dayjs()
      .subtract(2, 'week')
  },
  3: {
    label: '3 weeks',
    date: dayjs()
      .subtract(3, 'week')
  },
  4: {
    label: 'month',
    date: dayjs()
      .subtract(1, 'month')
  },
  5: {
    label: '2 months',
    date: dayjs()
      .subtract(2, 'month')
  },
  6: {
    label: '3 months',
    date: dayjs()
      .subtract(3, 'month')
  },
  7: {
    label: '4 months',
    date: dayjs()
      .subtract(4, 'month')
  },
  8: {
    label: '6 months',
    date: dayjs()
      .subtract(6, 'month')
  },
  9: {
    label: '9 months',
    date: dayjs()
      .subtract(9, 'month')
  },
  10: {
    label: 'year',
    date: dayjs()
      .subtract(1, 'year')
  }
};


const getDate = (type) => {

  switch (type) {
    case 0:
      return dayjs();
    case 1:
      return dayjs()
        .subtract(1, 'week');
    case 2:
      return dayjs()
        .subtract(2, 'week');
    case 3:
      return dayjs()
        .subtract(3, 'week');
    case 4:
      return dayjs()
        .subtract(1, 'month');
    case 5:
      return dayjs()
        .subtract(2, 'month');
    case 6:
      return dayjs()
        .subtract(3, 'month');
    case 7:
      return dayjs()
        .subtract(4, 'month');
    case 8:
      return dayjs()
        .subtract(6, 'month');
    case 9:
      return dayjs()
        .subtract(9, 'month');
    case 10:
      return dayjs()
        .subtract(1, 'year');
    default:
      return dayjs();
  }
};
