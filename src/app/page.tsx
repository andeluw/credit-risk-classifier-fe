'use client';

import axios from 'axios';
import { AlertCircle, CheckCircle2, Info, Loader2 } from 'lucide-react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Checkbox } from '@/components/checkbox';
import { Input } from '@/components/input';
import { Select } from '@/components/select';
import { Separator } from '@/components/separator';
import { Typography } from '@/components/typography';

/* ========= Types from backend ========= */

type RiskLevel = 'low' | 'medium' | 'high';

interface MlRaw {
  pred_class: number;
  proba_low: number;
  proba_high: number;
}

interface ExpertSystemResult {
  profile: {
    status: string;
  };
  financial: {
    level: string;
  };
  credit: {
    risk: string;
    rule_number: number;
  };
}

interface Explanation {
  rule: string;
  reason: string;
}

interface CreditRiskResult {
  final_prediction: string;
  confidence: number;
  ml_raw: MlRaw;
  expert_system_result: ExpertSystemResult;
  explanations: Explanation[];
}

interface ApiResponse {
  status: string;
  result: CreditRiskResult;
}

/* ========= Form values (mirrors ClientPayload) ========= */

interface FormValues {
  age: number;
  employment_status: 'employed' | 'self_employed' | 'unemployed' | 'retired';
  employment_type: 'permanent' | 'contract' | 'freelance' | 'business_owner';
  relationship_tenure_months: number;
  is_fraud: boolean;

  monthly_income_idr: number;
  avg_monthly_balance_idr: number;
  avg_deposit_amount_idr: number;
  debit_card_spending_idr: number;

  total_outstanding_debt_idr: number;
  loan_application_amount_idr: number;

  late_payments_last_years: number;
  slik_loan_history: 'kol1' | 'kol2' | 'kol3' | 'kol4' | 'kol5';

  active_loans_count: number;
}

/* ========= Presets from your samples ========= */

// High risk example
const HIGH_RISK_PRESET: FormValues = {
  age: 28,
  employment_status: 'self_employed',
  employment_type: 'freelance',
  relationship_tenure_months: 5,
  is_fraud: false,
  late_payments_last_years: 3,
  slik_loan_history: 'kol5',
  active_loans_count: 6,
  monthly_income_idr: 6_000_000,
  avg_monthly_balance_idr: 4_000_000,
  avg_deposit_amount_idr: 1_500_000,
  debit_card_spending_idr: 2_500_000,
  total_outstanding_debt_idr: 45_000_000,
  loan_application_amount_idr: 55_000_000,
};

// Low risk example
const LOW_RISK_PRESET: FormValues = {
  age: 32,
  employment_status: 'employed',
  employment_type: 'permanent',
  relationship_tenure_months: 48,
  is_fraud: false,
  late_payments_last_years: 0,
  slik_loan_history: 'kol1',
  active_loans_count: 1,
  monthly_income_idr: 15_000_000,
  avg_monthly_balance_idr: 40_000_000,
  avg_deposit_amount_idr: 5_000_000,
  debit_card_spending_idr: 6_000_000,
  total_outstanding_debt_idr: 20_000_000,
  loan_application_amount_idr: 60_000_000,
};

// Medium risk example
const MEDIUM_RISK_PRESET: FormValues = {
  age: 26,
  employment_status: 'self_employed',
  employment_type: 'freelance',
  relationship_tenure_months: 10,
  is_fraud: false,
  late_payments_last_years: 2,
  slik_loan_history: 'kol3',
  active_loans_count: 3,
  monthly_income_idr: 7_500_000,
  avg_monthly_balance_idr: 15_000_000,
  avg_deposit_amount_idr: 3_000_000,
  debit_card_spending_idr: 4_000_000,
  total_outstanding_debt_idr: 25_000_000,
  loan_application_amount_idr: 60_000_000,
};

/* ========= Select options (match Literal) ========= */

const employmentStatusOptions = [
  { label: 'Employed', value: 'employed' },
  { label: 'Self employed', value: 'self_employed' },
  { label: 'Unemployed', value: 'unemployed' },
  { label: 'Retired', value: 'retired' },
];

const employmentTypeOptions = [
  { label: 'Permanent', value: 'permanent' },
  { label: 'Contract', value: 'contract' },
  { label: 'Freelance', value: 'freelance' },
  { label: 'Business owner', value: 'business_owner' },
];

const slikHistoryOptions = [
  { label: 'Kolektibilitas 1 (no late payments)', value: 'kol1' },
  { label: 'Kolektibilitas 2 (1-90 days late)', value: 'kol2' },
  { label: 'Kolektibilitas 3 (91-120 days late)', value: 'kol3' },
  { label: 'Kolektibilitas 4 (121-180 days late)', value: 'kol4' },
  { label: 'Kolektibilitas 5 (>180 days late)', value: 'kol5' },
];

/* ========= Small helpers ========= */

const riskBadgeClassname: Record<RiskLevel, string> = {
  low: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  medium: 'bg-amber-50 text-amber-700 border border-amber-200',
  high: 'bg-rose-50 text-rose-700 border border-rose-200',
};

const riskLabel: Record<RiskLevel, string> = {
  low: 'Low risk',
  medium: 'Medium risk',
  high: 'High risk',
};

function normalizeRiskLevel(value: string): RiskLevel {
  const v = value.toLowerCase();
  if (v === 'low' || v === 'medium' || v === 'high') return v;
  return 'medium';
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/* ========= Page ========= */

export default function CreditRiskPage() {
  const methods = useForm<FormValues>({
    // defaultValues: HIGH_RISK_PRESET,
  });

  const { handleSubmit, reset } = methods;

  const [result, setResult] = React.useState<CreditRiskResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const onSubmit = async (values: FormValues) => {
    setErrorMessage(null);
    setIsLoading(true);
    setResult(null);

    try {
      const response = await axios.post<ApiResponse>(`${apiUrl}/api/evaluate`, {
        age: Number(values.age),
        employment_status: values.employment_status,
        employment_type: values.employment_type,
        relationship_tenure_months: Number(values.relationship_tenure_months),
        is_fraud: values.is_fraud,

        monthly_income_idr: Number(values.monthly_income_idr),
        avg_monthly_balance_idr: Number(values.avg_monthly_balance_idr),
        avg_deposit_amount_idr: Number(values.avg_deposit_amount_idr),
        debit_card_spending_idr: Number(values.debit_card_spending_idr),

        total_outstanding_debt_idr: Number(values.total_outstanding_debt_idr),
        loan_application_amount_idr: Number(values.loan_application_amount_idr),

        late_payments_last_years: Number(values.late_payments_last_years),
        slik_loan_history: values.slik_loan_history,
        active_loans_count: Number(values.active_loans_count),
      });

      setResult(response.data.result);
    } catch {
      setErrorMessage('The engine could not be reached. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderResult = () => {
    if (isLoading) {
      return (
        <div className='flex flex-col items-center justify-center gap-3 py-10'>
          <Loader2 className='h-6 w-6 animate-spin text-primary' />
          <Typography variant='b3' className='text-muted-foreground'>
            Engine is processing this application…
          </Typography>
        </div>
      );
    }

    if (errorMessage) {
      return (
        <div className='flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4'>
          <AlertCircle className='mt-0.5 h-5 w-5 text-destructive' />
          <div>
            <Typography variant='b3' className='font-medium text-destructive'>
              Unable to get a result
            </Typography>
            <Typography variant='c1' className='text-muted-foreground'>
              {errorMessage}
            </Typography>
          </div>
        </div>
      );
    }

    if (!result) {
      return (
        <div className='rounded-lg border border-dashed border-border bg-muted/40 p-6'>
          <Typography variant='b2' className='font-medium'>
            No assessment yet
          </Typography>
          <Typography variant='c1' className='mt-1 text-muted-foreground'>
            Fill in the fields above and run one assessment to see the
            prediction, confidence, and rule trace.
          </Typography>
        </div>
      );
    }

    const level = normalizeRiskLevel(result.final_prediction);
    const scorePercent = Math.round(result.confidence * 100);
    const { ml_raw, expert_system_result, explanations } = result;

    return (
      <div className='space-y-6'>
        {/* Overall result */}
        <div className='flex items-start justify-between gap-3'>
          <div className='space-y-1'>
            <Typography
              variant='c1'
              className='uppercase tracking-wide text-muted-foreground'
            >
              Final prediction
            </Typography>
            <Typography variant='h2'>{riskLabel[level]}</Typography>
            <Typography variant='b3' className='text-muted-foreground'>
              Combined decision from the machine learning model and the expert
              rules.
            </Typography>
          </div>
          <div
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${riskBadgeClassname[level]}`}
          >
            <CheckCircle2 className='h-4 w-4' />
            {riskLabel[level]}
          </div>
        </div>

        {/* Confidence bar */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Typography variant='b3' className='text-muted-foreground'>
              Confidence
            </Typography>
            <Typography variant='b2' className='font-semibold'>
              {scorePercent}%
            </Typography>
          </div>
          <div className='h-2 w-full overflow-hidden rounded-full bg-muted'>
            <div
              className='h-full rounded-full bg-primary-600 transition-[width]'
              style={{ width: `${scorePercent}%` }}
            />
          </div>
          <Typography variant='c1' className='text-muted-foreground'>
            This value shows how strongly the engine leans toward this risk
            class for the current application.
          </Typography>
        </div>

        {/* ML probabilities */}
        <div className='space-y-3 rounded-lg border bg-card p-3'>
          <div className='flex items-center gap-2'>
            <Info className='h-4 w-4 text-primary' />
            <Typography variant='b3' className='font-medium'>
              Machine learning view
            </Typography>
          </div>
          <div className='grid gap-2 text-sm md:grid-cols-2'>
            <div className='space-y-1'>
              <Typography
                variant='c1'
                className='text-muted-foreground uppercase tracking-wide'
              >
                Probability low
              </Typography>
              <Typography variant='b2'>
                {(ml_raw.proba_low * 100).toFixed(1)}%
              </Typography>
            </div>
            <div className='space-y-1'>
              <Typography
                variant='c1'
                className='text-muted-foreground uppercase tracking-wide'
              >
                Probability high
              </Typography>
              <Typography variant='b2'>
                {(ml_raw.proba_high * 100).toFixed(1)}%
              </Typography>
            </div>
          </div>
          <Typography variant='c1' className='text-muted-foreground'>
            These probabilities come directly from the classifier, before the
            rule engine refines the final decision.
          </Typography>
        </div>

        {/* Expert system summary */}
        <div className='space-y-3 rounded-lg border bg-card p-3'>
          <Typography variant='b3' className='font-medium'>
            Expert system summary
          </Typography>
          <div className='grid gap-3 text-sm md:grid-cols-3'>
            <div className='space-y-1'>
              <Typography
                variant='c1'
                className='text-muted-foreground uppercase tracking-wide'
              >
                Profile status
              </Typography>
              <Typography variant='b2'>
                {expert_system_result.profile.status}
              </Typography>
            </div>
            <div className='space-y-1'>
              <Typography
                variant='c1'
                className='text-muted-foreground uppercase tracking-wide'
              >
                Financial stress
              </Typography>
              <Typography variant='b2'>
                {expert_system_result.financial.level}
              </Typography>
            </div>
            <div className='space-y-1'>
              <Typography
                variant='c1'
                className='text-muted-foreground uppercase tracking-wide'
              >
                Credit risk from rules
              </Typography>
              <Typography variant='b2'>
                {expert_system_result.credit.risk} (rule{' '}
                {expert_system_result.credit.rule_number})
              </Typography>
            </div>
          </div>
        </div>

        {/* Rule-by-rule explanation */}
        {explanations && explanations.length > 0 && (
          <div className='space-y-3'>
            <Typography variant='b3' className='font-medium'>
              Rule trace
            </Typography>
            <div className='space-y-2 rounded-lg border bg-card p-3'>
              {explanations.map((exp) => (
                <div
                  key={exp.rule}
                  className='flex items-start gap-3 rounded-md bg-muted/60 px-3 py-2'
                >
                  <div className='mt-1 h-2 w-2 rounded-full bg-primary-600' />
                  <div className='space-y-0.5'>
                    <Typography variant='c1' className='font-medium'>
                      {exp.rule}
                    </Typography>
                    <Typography
                      variant='c2'
                      className='text-[11px] text-muted-foreground'
                    >
                      {exp.reason}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <main className='mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-8 md:px-6'>
      <header className='mb-8 space-y-2'>
        <Typography variant='j2' className='text-primary-800'>
          Credit Risk Classifier
        </Typography>
        <Typography variant='b2' className='max-w-2xl text-muted-foreground'>
          An integrated credit risk approach that combines ML predictions with a
          rule-based expert system.
        </Typography>
      </header>

      <section className='space-y-6'>
        {/* Form card */}
        <Card>
          <CardHeader className='space-y-3'>
            <div className='space-y-1'>
              <CardTitle>Application snapshot</CardTitle>
              <Typography variant='c1' className='text-muted-foreground'>
                Fill the profile, behaviour, and financial fields that feed the
                engine.
              </Typography>
            </div>

            {/* Preset buttons */}
            <div className='flex flex-wrap items-center gap-2'>
              <Typography variant='b3' className='text-muted-foreground mr-1'>
                Use example data:
              </Typography>
              <Button
                type='button'
                size='sm'
                variant='secondary'
                onClick={() => reset(HIGH_RISK_PRESET)}
              >
                High risk
              </Button>
              <Button
                type='button'
                size='sm'
                variant='secondary'
                onClick={() => reset(MEDIUM_RISK_PRESET)}
              >
                Medium risk
              </Button>
              <Button
                type='button'
                size='sm'
                variant='secondary'
                onClick={() => reset(LOW_RISK_PRESET)}
              >
                Low risk
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <FormProvider {...methods}>
              <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
                {/* Profile */}
                <div className='space-y-3 mt-2'>
                  <Typography variant='s2'>Profile</Typography>
                  <div className='grid gap-4 md:grid-cols-3'>
                    <Input
                      id='age'
                      label='Age'
                      type='number'
                      helperText='In years'
                      validation={{
                        required: 'Age is required',
                        min: { value: 18, message: 'Minimum age is 18' },
                      }}
                    />
                    <Select
                      id='employment_status'
                      label='Employment status'
                      options={employmentStatusOptions}
                      placeholder='Select'
                      validation={{
                        required: 'Employment status is required',
                      }}
                    />
                    <Select
                      id='employment_type'
                      label='Employment type'
                      options={employmentTypeOptions}
                      placeholder='Select'
                      validation={{
                        required: 'Employment type is required',
                      }}
                    />
                  </div>

                  <Input
                    id='relationship_tenure_months'
                    label='Relationship length'
                    type='number'
                    helperText='Client-institution relationship in months'
                    validation={{
                      required: 'Tenure is required',
                      min: { value: 0, message: 'Cannot be negative' },
                    }}
                  />

                  <div className='space-y-1'>
                    <Checkbox
                      name='is_fraud'
                      label='This application is flagged as potential fraud'
                      size='base'
                      value='true'
                    />
                  </div>
                </div>

                <Separator />

                {/* Behaviour & credit history */}
                <div className='space-y-3'>
                  <Typography variant='s2'>
                    Behaviour & credit history
                  </Typography>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <Input
                      id='late_payments_last_years'
                      label='Late payments (last years)'
                      type='number'
                      helperText='Across existing loans'
                      validation={{
                        required: 'This field is required',
                        min: { value: 0, message: 'Cannot be negative' },
                      }}
                    />
                    <Input
                      id='active_loans_count'
                      label='Active loans count'
                      type='number'
                      helperText='Number of loans currently active'
                      validation={{
                        required: 'Active loans count is required',
                        min: { value: 0, message: 'Cannot be negative' },
                      }}
                    />
                  </div>

                  {/* SLIK in single full-width row */}
                  <Select
                    id='slik_loan_history'
                    label='SLIK loan history (Kolektibilitas)'
                    options={slikHistoryOptions}
                    placeholder='Choose loan history'
                    validation={{
                      required: 'SLIK history is required',
                    }}
                  />
                </div>

                <Separator />

                {/* Financial snapshot */}
                <div className='space-y-3'>
                  <Typography variant='s2'>Financial snapshot</Typography>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <Input
                      id='monthly_income_idr'
                      label='Monthly income'
                      type='number'
                      prefix='Rp'
                      helperText='Stable income per month'
                      validation={{
                        required: 'Monthly income is required',
                        min: { value: 0, message: 'Must be positive' },
                      }}
                    />
                    <Input
                      id='avg_monthly_balance_idr'
                      label='Average monthly balance'
                      type='number'
                      prefix='Rp'
                      helperText='Average closing balance'
                      validation={{
                        required: 'Average balance is required',
                        min: { value: 0, message: 'Must be positive' },
                      }}
                    />
                  </div>

                  <div className='grid gap-4 md:grid-cols-2'>
                    <Input
                      id='avg_deposit_amount_idr'
                      label='Average deposit amount'
                      type='number'
                      prefix='Rp'
                      helperText='Typical deposit size'
                      validation={{
                        required: 'Average deposit is required',
                        min: { value: 0, message: 'Must be positive' },
                      }}
                    />
                    <Input
                      id='debit_card_spending_idr'
                      label='Debit card spending'
                      type='number'
                      prefix='Rp'
                      helperText='Average monthly spending'
                      validation={{
                        required: 'Spending is required',
                        min: { value: 0, message: 'Must be positive' },
                      }}
                    />
                  </div>

                  <Input
                    id='total_outstanding_debt_idr'
                    label='Total outstanding debt'
                    type='number'
                    prefix='Rp'
                    helperText='Remaining principal across all loans'
                    validation={{
                      required: 'Outstanding debt is required',
                      min: { value: 0, message: 'Must be positive' },
                    }}
                  />
                </div>

                <Separator />

                {/* Application details */}
                <div className='space-y-3'>
                  <Typography variant='s2'>Current application</Typography>
                  <Input
                    id='loan_application_amount_idr'
                    label='Requested loan amount'
                    type='number'
                    prefix='Rp'
                    helperText='Loan amount for this application'
                    validation={{
                      required: 'Requested amount is required',
                      min: { value: 0, message: 'Must be positive' },
                    }}
                  />
                </div>

                <Button
                  type='submit'
                  className='mt-2 w-full'
                  isLoading={isLoading}
                >
                  {isLoading ? 'Evaluating…' : 'Run assessment'}
                </Button>
              </form>
            </FormProvider>
          </CardContent>
        </Card>

        {/* Result card */}
        <Card>
          <CardHeader>
            <CardTitle>Classification result</CardTitle>
          </CardHeader>
          <CardContent>{renderResult()}</CardContent>
        </Card>
      </section>
    </main>
  );
}
