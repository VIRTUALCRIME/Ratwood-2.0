import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Input,
  NoticeBox,
  Section,
  Stack,
  TextArea,
} from 'tgui-core/components';

import { useBackend } from '../backend';
import { Window } from '../layouts';

type Data = {
  draft: string;
  preview_html: string;
  has_existing_text: boolean;
  signed: boolean;
  font: string;
  fonts: string[];
  maxlen: number;
  needs_import_confirm: boolean;
};

export const PaperWriterPanel = () => {
  const { act, data } = useBackend<Data>();
  const {
    draft: initialDraft,
    preview_html,
    has_existing_text,
    signed,
    font: backendFont,
    fonts,
    maxlen,
    needs_import_confirm,
  } = data;
  const [draft, setDraft] = useState(initialDraft || '');
  const [font, setFont] = useState(backendFont || 'default');
  const [colorHex, setColorHex] = useState('862f20');

  useEffect(() => {
    setDraft(initialDraft || '');
  }, [initialDraft]);

  useEffect(() => {
    setFont(backendFont || 'default');
  }, [backendFont]);

  const pushDraft = (nextDraft: string, nextFont: string = font) => {
    setDraft(nextDraft);
    act('update_draft', { draft: nextDraft, font: nextFont });
  };

  const pushFont = (nextFont: string) => {
    setFont(nextFont);
    act('update_draft', { draft, font: nextFont });
  };

  const appendToken = (startToken: string, endToken = '') => {
    pushDraft(`${draft}${startToken}${endToken}`);
  };

  const sanitizeColorHex = (value: string) => {
    const normalized = value.replace('#', '').trim().toUpperCase();
    return /^[0-9A-F]{6}$/.test(normalized) ? normalized : '862F20';
  };

  const insertColorBlock = (hexValue: string) => {
    const cleanHex = sanitizeColorHex(hexValue);
    setColorHex(cleanHex);
    appendToken(`-=${cleanHex}colored text=-`);
  };

  const remaining = Math.max(0, maxlen - draft.length);

  return (
    <Window width={760} height={680} title="Letter Editor">
      <Window.Content scrollable>
        <Stack vertical fill>
          <Stack.Item>
            <Section title="Preview (Saved + Current Input)">
              <NoticeBox>
                Supports existing paper formatting: # headers, **bold**, *italics*, ^size^,
                %s signature, %f field, and -=RRGGBBtext=- color blocks.
              </NoticeBox>
              {!!needs_import_confirm && (
                <NoticeBox danger mt={1}>
                  This letter was imported from existing formatted text. Saving may simplify older
                  formatting details. Use Save Anyway to confirm overwrite.
                </NoticeBox>
              )}
              <Box mt={1} mb={1} color="label">
                {has_existing_text ? 'Existing letter content is immutable.' : 'No saved content yet.'}{' '}
                New writing is appended below previous text.
              </Box>
              <Box mt={1} mb={1} color={signed ? 'good' : 'label'}>
                Signature status: {signed ? 'Signed' : 'Unsigned'}
              </Box>
              <Box
                style={{
                  background: '#fdf6e3',
                  border: '1px solid #b8a27d',
                  minHeight: '250px',
                  padding: '10px',
                  fontFamily: 'serif',
                }}
                dangerouslySetInnerHTML={{ __html: preview_html || '' }}
              />
            </Section>
          </Stack.Item>

          <Stack.Item>
            <Section title="Input (Append New Text)">
              <Stack mb={1} wrap>
                <Stack.Item>
                  <Button onClick={() => appendToken('**', '**')}>Bold</Button>
                </Stack.Item>
                <Stack.Item>
                  <Button onClick={() => appendToken('*', '*')}>Italics</Button>
                </Stack.Item>
                <Stack.Item>
                  <Button onClick={() => appendToken('# ')}>Header</Button>
                </Stack.Item>
                <Stack.Item>
                  <Button onClick={() => appendToken('^', '^')}>Large</Button>
                </Stack.Item>
                <Stack.Item>
                  <Button onClick={() => appendToken('((', '))')}>Small</Button>
                </Stack.Item>
                <Stack.Item>
                  <Button onClick={() => appendToken('\n---\n')}>Rule</Button>
                </Stack.Item>
                <Stack.Item>
                  <Button onClick={() => appendToken('%f')}>Field</Button>
                </Stack.Item>
                <Stack.Item>
                  <Button onClick={() => appendToken('\n* item')}>Bullet List</Button>
                </Stack.Item>
                <Stack.Item>
                  <Button onClick={() => appendToken('\n1. item')}>Numbered List</Button>
                </Stack.Item>
              </Stack>

              <Stack mb={1} wrap align="center">
                <Stack.Item>
                  <Box color="label">Color:</Box>
                </Stack.Item>
                <Stack.Item>
                  <Button onClick={() => insertColorBlock('862F20')}>Red Ink</Button>
                </Stack.Item>
                <Stack.Item>
                  <Button onClick={() => insertColorBlock('14103F')}>Blue Ink</Button>
                </Stack.Item>
                <Stack.Item>
                  <Button onClick={() => insertColorBlock('1A3A1A')}>Green</Button>
                </Stack.Item>
                <Stack.Item>
                  <Button onClick={() => insertColorBlock('8B6914')}>Gold</Button>
                </Stack.Item>
                <Stack.Item grow>
                  <Input
                    value={colorHex}
                    onChange={(value) => setColorHex(value.toUpperCase())}
                    placeholder="RRGGBB"
                    fluid
                  />
                </Stack.Item>
                <Stack.Item>
                  <Button onClick={() => insertColorBlock(colorHex)}>Insert Color</Button>
                </Stack.Item>
              </Stack>

              <Box mb={1}>
                <label>
                  Font:{' '}
                  <select
                    value={font}
                    onChange={(event) =>
                      pushFont((event.target as HTMLSelectElement).value)
                    }
                  >
                    {(fonts || []).map((fontName) => (
                      <option key={fontName} value={fontName}>
                        {fontName === 'default' ? 'Default Pen Font' : fontName}
                      </option>
                    ))}
                  </select>
                </label>
              </Box>

              <Box mt={1} mb={1} color={remaining < 50 ? 'bad' : 'label'}>
                Draft characters: {draft.length}/{maxlen}
              </Box>
              <TextArea
                height="220px"
                width="100%"
                value={draft}
                onChange={(value: string) => pushDraft(value)}
                placeholder="Write text to append under the existing letter..."
              />
            </Section>
          </Stack.Item>

          <Stack.Item>
            <Stack>
              <Stack.Item>
                <Button
                  color="good"
                  icon="save"
                  onClick={() => act('save')}>
                  Save
                </Button>
              </Stack.Item>
              <Stack.Item>
                <Button
                  color="good"
                  icon="signature"
                  onClick={() => act('sign')}>
                  Sign
                </Button>
              </Stack.Item>
              {!!needs_import_confirm && (
                <Stack.Item>
                  <Button
                    color="average"
                    icon="exclamation-triangle"
                    onClick={() => act('save', { force: 1 })}>
                    Save Anyway
                  </Button>
                </Stack.Item>
              )}
              <Stack.Item>
                <Button
                  color="average"
                  icon="eraser"
                  onClick={() => {
                    setDraft('');
                    act('clear');
                  }}>
                  Clear
                </Button>
              </Stack.Item>
              <Stack.Item>
                <Button
                  color="bad"
                  icon="times"
                  onClick={() => act('close')}>
                  Close
                </Button>
              </Stack.Item>
            </Stack>
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
};
