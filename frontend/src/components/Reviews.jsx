import { StarIcon } from '@heroicons/react/20/solid'

const reviews = {
    average: 4.2,
    totalCount: 1624,
    "counts": [
        { "rating": 5, "count": 1019 },
        { "rating": 4, "count": 162 },
        { "rating": 3, "count": 97 },
        { "rating": 2, "count": 199 },
        { "rating": 1, "count": 147 }
      ],
      "featured": [
        {
          "id": 1,
          "rating": 5,
          "content": "The custom-built gaming PC I received exceeded my expectations. High-end components and flawless performance. Definitely worth the investment!",
          "author": "Alex Johnson",
          "avatarSrc": "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
          "id": 2,
          "rating": 4,
          "content": "Impressed with the speedy delivery of my new tablet. It's sleek, runs all my apps smoothly, and the battery life is just incredible.",
          "author": "Samantha Brown",
          "avatarSrc": "https://randomuser.me/api/portraits/women/44.jpg"
        },   
      ]
  }
  

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Reviews = () =>  {
  return (
      <div className=" md:ml-[10rem] d">
         
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-32">
      <div className="lg:col-span-4">
        <h2 className="text-2xl font-bold tracking-tight  dark:text-white">Customer Reviews</h2>

        <div className="mt-3 flex items-center">
          <div>
            <div className="flex items-center">
              {[0, 1, 2, 3, 4].map((rating) => (
                <StarIcon
                  key={rating}
                  className={classNames(
                    reviews.average > rating ? 'text-yellow-400' : 'text-gray-300',
                    'h-5 w-5 flex-shrink-0'
                  )}
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className="sr-only">{reviews.average} out of 5 stars</p>
          </div>
          <p className="ml-2 text-sm text-gray-900dar: text-white">Based on {reviews.totalCount} reviews</p>
        </div>

        <div className="mt-6">
          <h3 className="sr-only">Review data</h3>

          <dl className="space-y-3">
            {reviews.counts.map((count) => (
              <div key={count.rating} className="flex items-center text-sm">
                <dt className="flex flex-1 items-center">
                  <p className="w-3 font-medium ">
                    {count.rating}
                    <span className="sr-only"> star reviews</span>
                  </p>
                  <div aria-hidden="true" className="ml-1 flex flex-1 items-center">
                    <StarIcon
                      className={classNames(
                        count.count > 0 ? 'text-yellow-400' : 'text-gray-300',
                        'h-5 w-5 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />

                    <div className="relative ml-3 flex-1">
                      <div className="h-3 rounded-full border border-gray-200 bg-gray-100" />
                      {count.count > 0 ? (
                        <div
                          className="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                          style={{ width: `calc(${count.count} / ${reviews.totalCount} * 100%)` }}
                        />
                      ) : null}
                    </div>
                  </div>
                </dt>
                <dd className="ml-3 w-10 text-right text-sm tabular-nums ">
                  {Math.round((count.count / reviews.totalCount) * 100)}%
                </dd>
              </div>
            ))}
          </dl>
        </div>
</div>

      <div className="mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0">
        <h3 className="sr-only">Recent reviews</h3>

        <div className="flow-root">
          <div className="-my-12 divide-y divide-gray-200">
            {reviews.featured.map((review) => (
              <div key={review.id} className="py-12">
                <div className="flex items-center">
                  <img src={review.avatarSrc} alt={`${review.author}.`} className="h-12 w-12 rounded-full" />
                  <div className="ml-4">
                    <h4 className="text-sm font-bold ">{review.author}</h4>
                    <div className="mt-1 flex items-center">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <StarIcon
                          key={rating}
                          className={classNames(
                            review.rating > rating ? 'text-yellow-400' : 'text-gray-300',
                            'h-5 w-5 flex-shrink-0'
                          )}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="sr-only">{review.rating} out of 5 stars</p>
                  </div>
                </div>

                <div
                  className="mt-4 space-y-6 text-base italic"
                  dangerouslySetInnerHTML={{ __html: review.content }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Reviews;