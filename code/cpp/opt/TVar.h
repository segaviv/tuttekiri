#pragma once

#include <Eigen/Eigen>
#include <iostream>
#include <tuple>

#include <Optiz/Autodiff/ProjectHessian.h>

namespace Optiz {

inline double sin(double x) { return std::sin(x); }
inline double cos(double x) { return std::cos(x); }

template <typename T, int k> class TVar {
public:
  using KVEC = Eigen::Matrix<T, k, 1>;
  using KMAT = Eigen::Matrix<T, k, k>;

  TVar() = default;
  TVar(const T &val, const KVEC &vec, const KMAT &mat)
      : _val(val), _grad(vec), _hessian(mat) {}

  TVar(const T &val) : _val(val) {}
  template <typename G, typename std::enable_if<std::is_arithmetic<G>::value,
                                                int>::type = 0>
  TVar(const G &val) : _val(T(val)) {}
  // TVar(double val) : _val(val) {}
  TVar(const T &val, int index) : _val(val) { _grad(index) = T(1.0); }

  // Getters.
  inline T val() const { return _val; }
  inline T &val() { return _val; }
  inline const KVEC &grad() const { return _grad; }
  inline KVEC &grad() { return _grad; }
  inline const KMAT &hessian() const { return _hessian; }
  inline KMAT &hessian() { return _hessian; }
  using Tup = std::tuple<T, Eigen::VectorXd, Eigen::MatrixXd>;
  inline operator Tup() const { return {_val, _grad, _hessian}; }

  TVar &projectHessian() {
    project_hessian(_hessian);
    return *this;
  }

  friend std::ostream &operator<<(std::ostream &s, const TVar &var) {
    s << "Val: " << var._val << std::endl
      << "Grad: " << std::endl
      << var._grad << std::endl
      << "Hessian: " << std::endl
      << var._hessian << std::endl;
    return s;
  }

  TVar &operator*=(const TVar &b) {
    _hessian *= b._val;
    _hessian += _grad * b._grad.transpose() + b._grad * _grad.transpose() +
                _val * b._hessian;

    _grad *= b._val;
    _grad += _val * b._grad;
    _val *= b._val;
    return *this;
  }
  TVar &operator*=(const T &b) {
    _val *= b;
    _grad *= b;
    _hessian *= b;
    return *this;
  }
  TVar &operator/=(const TVar &b) {
    _val /= b._val;
    _grad /= b._val;
    _grad -= b._grad * (_val / b._val);
    _hessian -= _grad * b._grad.transpose() + b._grad * _grad.transpose() +
                _val * b._hessian;
    _hessian /= b._val;
    return *this;
  }
  TVar &operator/=(const T &b) {
    _val /= b;
    _grad /= b;
    _hessian /= b;
    return *this;
  }
  TVar &operator+=(const TVar &b) {
    _val += b._val;
    _grad += b._grad;
    _hessian += b._hessian;
    return *this;
  }
  TVar &operator+=(double b) {
    _val += b;
    return *this;
  }
  TVar &operator-=(const TVar &b) {
    _val -= b._val;
    _grad -= b._grad;
    _hessian -= b._hessian;
    return *this;
  }
  TVar &operator-=(double b) {
    _val -= b;
    return *this;
  }
  TVar &chain_self(double val, double grad, double hessian) {
    _val = val;
    _hessian *= grad;
    _hessian += hessian * _grad * _grad.transpose();
    _grad *= grad;
    return *this;
  }
  TVar chain(const T &val, const T &grad, const T &hessian) const {
    return TVar(val, _grad * grad,
                _hessian * grad + hessian * _grad * _grad.transpose());
  }

  TVar inv() const {
    double valsqr = _val * _val;
    double valcube = valsqr * _val;
    return chain(1 / _val, -1 / valsqr, 2 / valcube);
  }
  TVar &inv_self() {
    double valsqr = _val * _val;
    double valcube = valsqr * _val;
    chain_self(1 / _val, -1 / valsqr, 2 / valcube);
    return *this;
  }
  TVar &neg() {
    chain_self(-_val, -1.0, 0.0);
    return *this;
  }

  // Mul operator between two TVars.
  friend TVar operator*(const TVar &a, const TVar &b) { return TVar(a) *= b; }
  template <typename G>
    requires(std::is_same_v<G, T> || std::is_arithmetic<G>::value)
  friend TVar operator*(const G &b, const TVar &a) {
    return TVar(a) *= T(b);
  }
  template <typename G>
    requires(std::is_same_v<G, T> || std::is_arithmetic<G>::value)
  friend TVar operator*(const TVar &a, const G &b) {
    return b * a;
  }

  // Div operator between two TVars.
  friend TVar operator/(const TVar &a, const TVar &b) { return TVar(a) /= b; }
  template <typename G>
    requires(std::is_same_v<G, T> || std::is_arithmetic<G>::value)
  friend TVar operator/(const G &b, const TVar &a) {
    return a.inv() * b;
  }
  template <typename G>
    requires(std::is_same_v<G, T> || std::is_arithmetic<G>::value)
  friend TVar operator/(const TVar &a, const G &b) {
    TVar res(a);
    res /= T(b);
    return res;
  }

  // Add operator between two TVars.
  friend TVar operator+(const TVar &a, const TVar &b) {
    // return TVar(a._val + b._val, a._grad + b._grad,
    //                  a._hessian + b._hessian);
    return TVar(a) += b;
  }
  // Add operator between TVar and double
  friend TVar operator+(double b, const TVar &a) { return a + b; }

  friend TVar operator+(const TVar &a, double b) { return TVar(a) += b; }

  // Sub operator between two TVars.
  friend TVar operator-(const TVar &a, const TVar &b) { return TVar(a) -= b; }
  // Sub operator between TVar and double
  friend TVar operator-(double b, const TVar &a) {
    TVar res(-a);
    res += b;
    return res;
  }
  friend TVar operator-(const TVar &a, double b) {
    TVar res(a);
    res -= b;
    return res;
  }

  friend TVar operator-(const TVar &a) {
    return a.chain(-a._val, -T(1.0), T(0.0));
  }
  friend TVar operator+(const TVar &a) {
    TVar res(a);
    res.projectHessian();
    return res;
  }
  friend TVar sqrt(const TVar &a) {
    const auto &sqrt_a = sqrt(a._val);
    return a.chain(sqrt_a, 0.5 / sqrt_a, -0.25 / (sqrt_a * a._val));
  }
  friend TVar abs(const TVar &a) {
    return a.chain(a._val, a._val >= 0 ? 1 : -1, 0);
  }
  friend TVar pow(const TVar &a, double exponent) {
    double f2 = std::pow(a.val(), exponent - 2);
    double f1 = f2 * a.val();
    double f = f1 * a.val();

    return a.chain(f, exponent * f1, exponent * (exponent - 1) * f2);
  }
  friend TVar pow(const TVar &a, const int exponent) {
    double f2 = std::pow(a.val(), exponent - 2);
    double f1 = f2 * a.val();
    double f = f1 * a.val();

    return a.chain(f, exponent * f1, exponent * (exponent - 1) * f2);
  }
  friend TVar exp(const TVar &a) {
    double val = std::exp(a._val);
    return a.chain(val, val, val);
  }
  friend TVar log(const TVar &a) {
    return a.chain(std::log(a._val), 1 / a._val, -1 / (a._val * a._val));
  }
  friend TVar sin(const TVar &a) {
    T sinval = sin(a._val);
    return a.chain(sinval, cos(a._val), -sinval);
  }
  friend TVar cos(const TVar &a) {
    T cosval = cos(a._val);
    return a.chain(cosval, -sin(a._val), -cosval);
  }
  friend TVar atan2(const TVar &y, const TVar &x) {
    double val = std::atan2(y._val, x._val);
    double x_sqr = x._val * x._val, y_sqr = y._val * y._val;
    double denom = x_sqr + y_sqr;
    double denom_sqr = denom * denom;
    // First order derivatives.
    double dx = -y._val / denom;
    double dy = x._val / denom;
    // Second order derivatives.
    double dxdx = 2 * x._val * y._val / denom_sqr;
    double dydy = -dxdx;
    double dxdy = (y_sqr - x_sqr) / denom_sqr;
    return chain2(x, y, val, dx, dy, dxdx, dxdy, dydy);
  }

  // Chain rule for multivariate function (with 2 variables, R^2 -> R).
  friend TVar chain2(const TVar &a, const TVar &b, double val, double da,
                     double db, double dada, double dadb, double dbdb) {
    TVar res(val);
    res._grad = da * a._grad + db * b._grad;
    res._hessian =
        da * a._hessian + db * b._hessian +
        dada * a._grad * a._grad.transpose() +
        dadb * (a._grad * b._grad.transpose() + b._grad * a._grad.transpose()) +
        dbdb * b._grad * b._grad.transpose();
    return res;
  }

  // Chain rule for multivariate function (R^n -> R).
  // chain(vars, f(v1, v2, ..., vn), df/dvi, d2f/dvidvj).
  friend TVar chain(const Eigen::VectorX<TVar> &vars, double val,
                    const Eigen::VectorXd &grad,
                    const Eigen::MatrixXd &hessian) {
    TVar res(val);
    for (int i = 0; i < vars.size(); ++i) {
      res._grad += grad(i) * vars[i]._grad;
      res._hessian += grad(i) * vars[i]._hessian;
      for (int j = 0; j < vars.size(); ++j) {
        res._hessian +=
            hessian(i, j) * vars[i]._grad * vars[j]._grad.transpose();
      }
    }
    return res;
  }

  // ----------------------- Comparisons -----------------------
  friend bool operator<(const TVar &a, const TVar &b) {
    return a._val < b._val;
  }
  friend bool operator<=(const TVar &a, const TVar &b) {
    return a._val <= b._val;
  }
  friend bool operator>(const TVar &a, const TVar &b) {
    return a._val > b._val;
  }
  friend bool operator>=(const TVar &a, const TVar &b) {
    return a._val >= b._val;
  }
  friend bool operator==(const TVar &a, const TVar &b) {
    return a._val == b._val;
  }
  friend bool operator!=(const TVar &a, const TVar &b) {
    return a._val != b._val;
  }

private:
  T _val = T(0);
  KVEC _grad = KVEC::Zero();
  KMAT _hessian = KMAT::Zero();
};

template <typename T, int k> TVar<T, k> sqr(const TVar<T, k> &a) {
  return a.chain(a.val() * a.val(), 2 * a.val(), 2);
}

} // namespace Optiz

namespace Eigen {

/**
 * See https://eigen.tuxfamily.org/dox/TopicCustomizing_CustomScalar.html
 * and https://eigen.tuxfamily.org/dox/structEigen_1_1NumTraits.html
 */
template <typename T, int k>
struct NumTraits<Optiz::TVar<T, k>> : NumTraits<double> {
  typedef Optiz::TVar<T, k> Real;
  typedef Optiz::TVar<T, k> NonInteger;
  typedef Optiz::TVar<T, k> Nested;

  enum {
    IsComplex = 0,
    IsInteger = 0,
    IsSigned = 1,
    RequireInitialization = 1,
    ReadCost = k * k,
    AddCost = k * k,
    MulCost = k * k * k,
  };
};

template <typename BinaryOp, typename T, int k>
struct ScalarBinaryOpTraits<
    Optiz::TVar<T, k>,
    typename std::enable_if<!std::is_arithmetic<T>::value, T>::type, BinaryOp> {
  typedef Optiz::TVar<T, k> ReturnType;
};

template <typename BinaryOp, typename T, int k>
struct ScalarBinaryOpTraits<Optiz::TVar<T, k>, double, BinaryOp> {
  typedef Optiz::TVar<T, k> ReturnType;
};

template <typename BinaryOp, typename T, int k>
struct ScalarBinaryOpTraits<
    typename std::enable_if<!std::is_arithmetic<T>::value, T>::type,
    Optiz::TVar<T, k>, BinaryOp> {
  typedef Optiz::TVar<T, k> ReturnType;
};

template <typename BinaryOp, typename T, int k>
struct ScalarBinaryOpTraits<double, Optiz::TVar<T, k>, BinaryOp> {
  typedef Optiz::TVar<T, k> ReturnType;
};

} // namespace Eigen