
-- Add "First Referral" badge to the award_connector_badges function
-- This adds a new badge type that's awarded for 1 successful referral

CREATE OR REPLACE FUNCTION public.award_connector_badges(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'extensions'
AS $$
DECLARE
  referral_count INTEGER;
  badge_awarded BOOLEAN := FALSE;
BEGIN
  -- Get current referral count for the user
  SELECT COUNT(*) INTO referral_count
  FROM public.user_referrals
  WHERE referrer_id = p_user_id;
  
  -- Award First Referral badge (1 referral)
  IF referral_count >= 1 AND NOT EXISTS(
    SELECT 1 FROM public.badges 
    WHERE user_id = p_user_id AND badge_type = 'connector_first'
  ) THEN
    INSERT INTO public.badges (user_id, badge_type, badge_name, description, criteria_met)
    VALUES (
      p_user_id, 
      'connector_first', 
      'First Referral', 
      'Awarded for successfully referring your first friend to ParentPal',
      json_build_object('referral_count', referral_count)
    );
    badge_awarded := TRUE;
  END IF;
  
  -- Award Bronze Connector badge (5 referrals)
  IF referral_count >= 5 AND NOT EXISTS(
    SELECT 1 FROM public.badges 
    WHERE user_id = p_user_id AND badge_type = 'connector_bronze'
  ) THEN
    INSERT INTO public.badges (user_id, badge_type, badge_name, description, criteria_met)
    VALUES (
      p_user_id, 
      'connector_bronze', 
      'Bronze Connector', 
      'Awarded for successfully referring 5 friends to ParentPal',
      json_build_object('referral_count', referral_count)
    );
    badge_awarded := TRUE;
  END IF;
  
  -- Award Silver Connector badge (20 referrals)
  IF referral_count >= 20 AND NOT EXISTS(
    SELECT 1 FROM public.badges 
    WHERE user_id = p_user_id AND badge_type = 'connector_silver'
  ) THEN
    INSERT INTO public.badges (user_id, badge_type, badge_name, description, criteria_met)
    VALUES (
      p_user_id, 
      'connector_silver', 
      'Silver Connector', 
      'Awarded for successfully referring 20 friends to ParentPal',
      json_build_object('referral_count', referral_count)
    );
    badge_awarded := TRUE;
  END IF;
  
  -- Award Gold Connector badge (50 referrals)
  IF referral_count >= 50 AND NOT EXISTS(
    SELECT 1 FROM public.badges 
    WHERE user_id = p_user_id AND badge_type = 'connector_gold'
  ) THEN
    INSERT INTO public.badges (user_id, badge_type, badge_name, description, criteria_met)
    VALUES (
      p_user_id, 
      'connector_gold', 
      'Gold Connector', 
      'Awarded for successfully referring 50 friends to ParentPal',
      json_build_object('referral_count', referral_count)
    );
    badge_awarded := TRUE;
  END IF;
  
  RETURN json_build_object('success', TRUE, 'badge_awarded', badge_awarded, 'referral_count', referral_count);
END;
$$;

-- Retroactively award "First Referral" badges to existing users who have referrals but no badges
DO $$
BEGIN
  -- Award First Referral badges to users who have at least 1 referral but no connector badges yet
  INSERT INTO public.badges (user_id, badge_type, badge_name, description, criteria_met)
  SELECT 
    ur.referrer_id,
    'connector_first',
    'First Referral',
    'Awarded for successfully referring your first friend to ParentPal',
    json_build_object('referral_count', referral_counts.count)
  FROM (
    SELECT referrer_id, COUNT(*) as count
    FROM public.user_referrals
    GROUP BY referrer_id
    HAVING COUNT(*) >= 1
  ) referral_counts
  JOIN public.user_referrals ur ON referral_counts.referrer_id = ur.referrer_id
  WHERE NOT EXISTS (
    SELECT 1 FROM public.badges b 
    WHERE b.user_id = ur.referrer_id 
    AND b.badge_type IN ('connector_first', 'connector_bronze', 'connector_silver', 'connector_gold')
  )
  GROUP BY ur.referrer_id, referral_counts.count;
END $$;
