/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Lead, GTMEvent, ICPKey } from './types';
import { icpList } from './data/icpData';
import MarketingHub from './components/MarketingHub';
import LPBuilder from './components/LPBuilder';
import MainLandingPage from './components/MainLandingPage';
import { initGoogleAnalytics, trackPageView, trackEvent } from './utils/analytics';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [gtmEvents, setGtmEvents] = useState<GTMEvent[]>([]);

  // Initialize GA4 and load leads from localStorage on mount
  useEffect(() => {
    initGoogleAnalytics();
    trackPageView(window.location.pathname);

    const cached = localStorage.getItem('energiza_leads');
    if (cached) {
      try {
        setLeads(JSON.parse(cached));
      } catch (e) {
        console.error('Error loading leads cache:', e);
      }
    }

    // Listen for browser navigation (back/forward buttons)
    const handlePopState = () => {
      const newPath = window.location.pathname;
      setCurrentPath(newPath);
      trackPageView(newPath);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Safe navigation handler
  const navigateTo = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    trackPageView(path);
    
    // Smooth scroll top on navigation
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Safe GTM and GA4 event trigger and logger
  const triggerGTMEvent = (eventName: string, elementId: string, metadata?: any) => {
    const activeIcp = icpList.find(i => `/${i.slug}` === currentPath)?.slug || 'generalist';

    const newEvent: GTMEvent = {
      id: 'evt_' + Math.random().toString(36).substr(2, 9),
      eventName,
      icpSlug: activeIcp as ICPKey,
      elementId,
      timestamp: new Date().toISOString(),
      meta: metadata,
    };

    setGtmEvents(prev => [newEvent, ...prev].slice(0, 50));
    trackEvent(eventName, { elementId, activeIcp, ...metadata });
  };

  const handleLeadCaptured = (newLead: Lead) => {
    setLeads(prev => [newLead, ...prev]);
    triggerGTMEvent('lead_captured', 'form_lead_submit', { lead_id: newLead.id, icp: newLead.icp });
  };

  const clearGtmLogs = () => {
    setGtmEvents([]);
  };

  // Admin Dashboard route
  if (currentPath === '/admin' || currentPath === '/marketing-hub') {
    return (
      <MarketingHub
        onSelectICP={(slug) => {
          triggerGTMEvent('hub_view_lp_click', `btn_view_lp_${slug}`);
          navigateTo(`/${slug}`);
        }}
        leads={leads}
        setLeads={setLeads}
        gtmEvents={gtmEvents}
        clearGtmEvents={clearGtmLogs}
      />
    );
  }

  // Detect if an ICP landing page is active based on path
  const activeIcpConfig = icpList.find(icp => `/${icp.slug}` === currentPath);

  if (activeIcpConfig) {
    return (
      <LPBuilder
        config={activeIcpConfig}
        onLeadCaptured={handleLeadCaptured}
        onGTMEvent={triggerGTMEvent}
        onBackToHub={() => {
          triggerGTMEvent('navigation_to_home', 'btn_back_to_home');
          navigateTo('/');
        }}
      />
    );
  }

  // Default to Main Generalist Landing Page for '/' and any non-matched public routes
  return (
    <MainLandingPage
      onSelectICP={(slug) => {
        triggerGTMEvent('generalist_icp_select', `btn_icp_${slug}`);
        navigateTo(`/${slug}`);
      }}
      onLeadCaptured={handleLeadCaptured}
      onOpenAdmin={() => {
        navigateTo('/admin');
      }}
    />
  );
}


