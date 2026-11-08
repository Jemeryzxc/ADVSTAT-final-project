export type RegressionResult = { n:number; slope:number; intercept:number; r:number; rSquared:number; strength:string; points:{x:number;y:number;fit:number}[] };
const mean = (values:number[]) => values.reduce((sum,v)=>sum+v,0)/values.length;
export function calculateRegression(xs:number[], ys:number[]): RegressionResult {
  if (xs.length !== ys.length || xs.length < 2) throw new Error('Enter at least two paired X and Y values.');
  if (![...xs,...ys].every(Number.isFinite)) throw new Error('All values must be valid numbers.');
  const mx=mean(xs), my=mean(ys);
  const ssx=xs.reduce((s,x)=>s+(x-mx)**2,0), ssy=ys.reduce((s,y)=>s+(y-my)**2,0);
  if (ssx===0 || ssy===0) throw new Error('X and Y values must each have some variation.');
  const covariance=xs.reduce((s,x,i)=>s+(x-mx)*(ys[i]-my),0);
  const slope=covariance/ssx, intercept=my-slope*mx, r=covariance/Math.sqrt(ssx*ssy), abs=Math.abs(r);
  const strength=abs>=0.8?'Strong':abs>=0.5?'Moderate':abs>=0.3?'Weak':'Very weak';
  return {n:xs.length,slope,intercept,r,rSquared:r*r,strength,points:xs.map((x,i)=>({x,y:ys[i],fit:intercept+slope*x}))};
}
export type HypothesisResult = {z:number;pValue:number;critical:number;alpha:number;tail:string;decision:string;conclusion:string};
function erf(x:number) { const sign=x<0?-1:1; x=Math.abs(x); const t=1/(1+0.3275911*x); const y=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-x*x); return sign*y; }
const normalCdf=(z:number)=>0.5*(1+erf(z/Math.sqrt(2)));
const inverseNormal=(p:number) => { // Acklam approximation
  const a=[-3.969683028665376e1,2.209460984245205e2,-2.759285104469687e2,1.38357751867269e2,-3.066479806614716e1,2.506628277459239];
  const b=[-5.447609879822406e1,1.615858368580409e2,-1.556989798598866e2,6.680131188771972e1,-1.328068155288572e1];
  const c=[-7.784894002430293e-3,-3.223964580411365e-1,-2.400758277161838,-2.549732539343734,4.374664141464968,2.938163982698783];
  const d=[7.784695709041462e-3,3.224671290700398e-1,2.445134137142996,3.754408661907416]; const plow=0.02425, phigh=1-plow; let q,r;
  if(p<plow){q=Math.sqrt(-2*Math.log(p));return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);}
  if(p>phigh){q=Math.sqrt(-2*Math.log(1-p));return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);}
  q=p-0.5;r=q*q;return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
};
export function calculateZTest(args:{sampleMean:number;populationMean:number;populationSd:number;sampleSize:number;alpha:number;tail:'two'|'left'|'right'}) : HypothesisResult {
  const {sampleMean,populationMean,populationSd,sampleSize,alpha,tail}=args;
  if (![sampleMean,populationMean,populationSd,sampleSize,alpha].every(Number.isFinite) || populationSd<=0 || sampleSize<1 || ![0.1,0.05,0.01,0.001].includes(alpha)) throw new Error('Check inputs: SD must be positive, sample size at least 1, and alpha must be a supported level.');
  const z=(sampleMean-populationMean)/(populationSd/Math.sqrt(sampleSize));
  const cdf=normalCdf(z); const pValue=tail==='two'?Math.min(1,2*Math.min(cdf,1-cdf)):tail==='left'?cdf:1-cdf;
  const critical=tail==='two'?inverseNormal(1-alpha/2):tail==='left'?inverseNormal(alpha):inverseNormal(1-alpha);
  const reject=pValue<alpha;
  return {z,pValue,critical,alpha,tail,decision:reject?'Reject H₀':'Fail to reject H₀',conclusion:reject?'The result is statistically significant at the selected alpha level.':'There is not enough evidence to reject the null hypothesis at the selected alpha level.'};
}
export function calculateTwoSampleZTest(args:{mean1:number;mean2:number;sd1:number;sd2:number;n1:number;n2:number;alpha:number;tail:'two'|'left'|'right'}):HypothesisResult {
 const {mean1,mean2,sd1,sd2,n1,n2,alpha,tail}=args;
 if (![mean1,mean2,sd1,sd2,n1,n2,alpha].every(Number.isFinite)||sd1<=0||sd2<=0||n1<1||n2<1||![0.1,0.05,0.01,0.001].includes(alpha)) throw new Error('Check inputs: both SDs must be positive, sample sizes at least 1, and alpha must be supported.');
 const z=(mean1-mean2)/Math.sqrt(sd1*sd1/n1+sd2*sd2/n2);const cdf=normalCdf(z);const pValue=tail==='two'?Math.min(1,2*Math.min(cdf,1-cdf)):tail==='left'?cdf:1-cdf;const critical=tail==='two'?inverseNormal(1-alpha/2):tail==='left'?inverseNormal(alpha):inverseNormal(1-alpha);const reject=pValue<alpha;
 return {z,pValue,critical,alpha,tail,decision:reject?'Reject H₀':'Fail to reject H₀',conclusion:reject?'The result is statistically significant at the selected alpha level.':'There is not enough evidence to reject the null hypothesis at the selected alpha level.'};
}
