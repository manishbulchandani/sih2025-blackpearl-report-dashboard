# Shared Components

This directory contains reusable UI components that can be used across multiple pipeline steps.

## 📁 Components

### StatusBadge
**Purpose**: Display status indicators with consistent styling
**Usage**: Pipeline readiness, warnings, errors, processing states
**Props**:
- `status`: 'ready' | 'warning' | 'error' | 'processing'
- `message`: Status message
- `description?`: Optional detailed description

```tsx
<StatusBadge 
  status="ready" 
  message="Ready for next step"
  description="All checks passed"
/>
```

### DownloadSection
**Purpose**: Organized file download interface
**Usage**: Multiple file downloads grouped by category
**Props**:
- `downloads`: Array of download categories with items

```tsx
<DownloadSection downloads={[
  {
    category: 'Raw Data',
    items: [
      {
        name: 'FASTQ Files',
        description: 'Raw sequencing data',
        filename: 'raw/data.fastq.gz',
        type: 'fastq'
      }
    ]
  }
]} />
```

### EmbeddedReport
**Purpose**: Display HTML reports in iframe with controls
**Usage**: QC reports, analysis outputs
**Props**:
- `title`: Report title
- `description`: Report description
- `htmlFile`: Path to HTML file
- `type`: Report type for styling

```tsx
<EmbeddedReport
  title="Quality Control Report"
  description="Comprehensive QC analysis"
  htmlFile="qc/report.html"
  type="multiqc"
/>
```

## 🎯 Design Principles

### Consistency
- Uniform color schemes
- Standardized spacing
- Consistent typography

### Reusability
- Generic prop interfaces
- Configurable styling
- Type-safe implementations

### Accessibility
- Semantic HTML
- ARIA attributes
- Keyboard navigation

## 🎨 Styling

Uses Tailwind CSS with consistent color palette:
- **Success**: Green (ready states)
- **Warning**: Yellow (attention needed)
- **Error**: Red (critical issues)
- **Info**: Blue (informational)
- **Processing**: Blue (ongoing tasks)

## 🔄 Future Components

Potential additions for other pipeline steps:
- DataTable (for tabular data)
- ParameterForm (for configuration)
- ProgressIndicator (for long-running tasks)
- ComparisonView (for before/after analysis)
- MetricsGrid (for multiple metrics display)