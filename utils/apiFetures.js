class APIFeatures {
  constructor(query, reqQuery) {
    this.query = query;
    this.reqQuery = reqQuery;
  }

  filter() {
    const queryObj = { ...this.reqQuery };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.forEach((el) => delete queryObj[el]);

    //1B) Advance Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    //console.log(JSON.parse(queryStr));
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.reqQuery.sort) {
      const querySort = this.reqQuery.sort.split(',').join(' ');
      this.query = this.query.sort(querySort);
    } else {
      this.query = this.query.sort('createdAt');
    }
    //console.log(await this.query);
    return this;
  }

  fieldsSelect() {
    if (this.reqQuery.fields) {
      const querySort = this.reqQuery.fields.split(',').join(' ');
      this.query = this.query.select(querySort);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagent() {
    const page = this.reqQuery.page * 1 || 1;
    const limit = this.reqQuery.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
