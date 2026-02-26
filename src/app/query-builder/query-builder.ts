/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterQuery, Query } from "mongoose";

// create Query builder query
class QueryBuilder<T> {
  // query obj
  query: Record<string, any>;
  // query model
  modelQuery: Query<T[], T>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, any>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // create search method for search data
  search(feilds: string[]) {
    const searchObj: Record<string, Record<string, object>[]> = { $or: [] };

    // check feild exist or not in query
    feilds.forEach((feild) => {
      // if feild exist in query, store it in feildExist
      if (this.query.search) {
        searchObj.$or.push({
          [feild]: { $regex: this.query.search, $options: "i" },
        });
      }
    });

    // if serachObj.$or.length > 0, means search data exist, then search by search data, therwise get add data
    this.modelQuery.find(
      (searchObj.$or as []).length > 0 ? (searchObj as FilterQuery<T>) : {},
    );

    return this;
  }

  // create filter method for filter by pricePerHour
  filter(feild: string) {
    // if feild exist in query
    if (this.query[feild]) {
      const filterObj = {
        [feild]: { $lte: Number(this.query[feild]) },
      };
      this.modelQuery.find(filterObj as FilterQuery<T>);
    }

    return this;
  }

  // create sort method for sort
  sort(feild: string) {
    // if feild exist in query
    if (this.query[feild]) {
      this.modelQuery.sort({ [feild]: this.query[feild] });
    }

    return this;
  }

  // create document count method for count document
  async documentCount() {
    // get query from modelQuery
    const query = this.modelQuery.getQuery();

    // get total document
    const totalDocument = await this.modelQuery.model.countDocuments(query);

    return totalDocument;
  }

  // create paginate method for pagination
  paginate() {
    // get page number from query
    const page = Number(this.query.page);

    this.modelQuery.skip(9 * (page - 1)).limit(9);
  }
}

export default QueryBuilder;
